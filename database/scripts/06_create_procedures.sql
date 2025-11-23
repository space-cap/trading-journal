-- ============================================
-- 06_create_procedures.sql
-- 설명: 저장 프로시저 생성
-- 실행 순서: 6번째
-- 전제조건: 02_create_tables.sql 실행 완료
-- ============================================

USE trading_journal;

-- ============================================
-- 프로시저 1: sp_close_trade
-- 설명: 매매 청산 처리
-- 파라미터:
--   - p_trade_id: 매매 ID
--   - p_exit_price: 청산 가격
--   - p_exit_date: 청산 일시 (NULL이면 현재 시각)
-- ============================================

DELIMITER $$

CREATE PROCEDURE sp_close_trade(
    IN p_trade_id BIGINT,
    IN p_exit_price DECIMAL(15,2),
    IN p_exit_date DATETIME(3)
)
BEGIN
    DECLARE v_entry_date DATETIME(3);
    DECLARE v_deleted_at DATETIME(3);
    
    -- 매매 존재 여부 및 상태 확인
    SELECT entry_date, deleted_at
    INTO v_entry_date, v_deleted_at
    FROM trades
    WHERE trade_id = p_trade_id;
    
    -- 매매가 존재하지 않는 경우
    IF v_entry_date IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '해당 매매를 찾을 수 없습니다.';
    END IF;
    
    -- 삭제된 매매인 경우
    IF v_deleted_at IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '삭제된 매매는 청산할 수 없습니다.';
    END IF;
    
    -- 청산 일시가 NULL이면 현재 시각으로 설정
    IF p_exit_date IS NULL THEN
        SET p_exit_date = CURRENT_TIMESTAMP(3);
    END IF;
    
    -- 청산 일시가 진입 일시보다 이전인 경우
    IF p_exit_date <= v_entry_date THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '청산 일시는 진입 일시보다 이후여야 합니다.';
    END IF;
    
    -- 청산 가격이 0 이하인 경우
    IF p_exit_price <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '청산 가격은 0보다 커야 합니다.';
    END IF;
    
    -- 매매 청산 처리
    UPDATE trades
    SET exit_price = p_exit_price,
        exit_date = p_exit_date,
        updated_at = CURRENT_TIMESTAMP(3)
    WHERE trade_id = p_trade_id;
    
    -- 결과 반환
    SELECT 
        trade_id,
        symbol,
        entry_price,
        quantity,
        fee,
        entry_date,
        exit_price,
        exit_date,
        (exit_price * quantity) - (entry_price * quantity) - fee AS realized_pnl
    FROM trades
    WHERE trade_id = p_trade_id;
END$$

DELIMITER ;

-- ============================================
-- 프로시저 2: sp_soft_delete_trade
-- 설명: 매매 논리 삭제
-- 파라미터:
--   - p_trade_id: 매매 ID
-- ============================================

DELIMITER $$

CREATE PROCEDURE sp_soft_delete_trade(
    IN p_trade_id BIGINT
)
BEGIN
    DECLARE v_deleted_at DATETIME(3);
    
    -- 매매 존재 여부 확인
    SELECT deleted_at
    INTO v_deleted_at
    FROM trades
    WHERE trade_id = p_trade_id;
    
    -- 매매가 존재하지 않는 경우
    IF v_deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM trades WHERE trade_id = p_trade_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '해당 매매를 찾을 수 없습니다.';
    END IF;
    
    -- 이미 삭제된 매매인 경우
    IF v_deleted_at IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '이미 삭제된 매매입니다.';
    END IF;
    
    -- 논리 삭제 처리
    UPDATE trades
    SET deleted_at = CURRENT_TIMESTAMP(3),
        updated_at = CURRENT_TIMESTAMP(3)
    WHERE trade_id = p_trade_id;
    
    SELECT CONCAT('Trade ID ', p_trade_id, ' has been soft deleted.') AS message;
END$$

DELIMITER ;

-- ============================================
-- 프로시저 3: sp_restore_trade
-- 설명: 삭제된 매매 복원
-- 파라미터:
--   - p_trade_id: 매매 ID
-- ============================================

DELIMITER $$

CREATE PROCEDURE sp_restore_trade(
    IN p_trade_id BIGINT
)
BEGIN
    DECLARE v_deleted_at DATETIME(3);
    
    -- 매매 존재 여부 확인
    SELECT deleted_at
    INTO v_deleted_at
    FROM trades
    WHERE trade_id = p_trade_id;
    
    -- 매매가 존재하지 않는 경우
    IF v_deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM trades WHERE trade_id = p_trade_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '해당 매매를 찾을 수 없습니다.';
    END IF;
    
    -- 삭제되지 않은 매매인 경우
    IF v_deleted_at IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '삭제되지 않은 매매입니다.';
    END IF;
    
    -- 복원 처리
    UPDATE trades
    SET deleted_at = NULL,
        updated_at = CURRENT_TIMESTAMP(3)
    WHERE trade_id = p_trade_id;
    
    SELECT CONCAT('Trade ID ', p_trade_id, ' has been restored.') AS message;
END$$

DELIMITER ;

-- ============================================
-- 프로시저 4: sp_get_trade_statistics
-- 설명: 기간별 매매 통계 조회
-- 파라미터:
--   - p_start_date: 시작 일시
--   - p_end_date: 종료 일시
-- ============================================

DELIMITER $$

CREATE PROCEDURE sp_get_trade_statistics(
    IN p_start_date DATETIME(3),
    IN p_end_date DATETIME(3)
)
BEGIN
    SELECT 
        COUNT(*) AS total_trades,
        SUM(CASE WHEN exit_price IS NOT NULL THEN 1 ELSE 0 END) AS closed_trades,
        SUM(CASE WHEN exit_price IS NULL THEN 1 ELSE 0 END) AS open_trades,
        SUM(CASE 
            WHEN exit_price IS NOT NULL THEN
                (exit_price * quantity) - (entry_price * quantity) - fee
            ELSE 0
        END) AS total_realized_pnl,
        AVG(CASE 
            WHEN exit_price IS NOT NULL THEN
                (exit_price * quantity) - (entry_price * quantity) - fee
            ELSE NULL
        END) AS avg_realized_pnl,
        SUM(CASE 
            WHEN exit_price IS NOT NULL AND (exit_price * quantity) - (entry_price * quantity) - fee > 0 THEN 1
            ELSE 0
        END) AS winning_trades,
        SUM(CASE 
            WHEN exit_price IS NOT NULL AND (exit_price * quantity) - (entry_price * quantity) - fee <= 0 THEN 1
            ELSE 0
        END) AS losing_trades,
        CASE 
            WHEN SUM(CASE WHEN exit_price IS NOT NULL THEN 1 ELSE 0 END) > 0 THEN
                ROUND((SUM(CASE 
                    WHEN exit_price IS NOT NULL AND (exit_price * quantity) - (entry_price * quantity) - fee > 0 THEN 1
                    ELSE 0
                END) * 100.0 / SUM(CASE WHEN exit_price IS NOT NULL THEN 1 ELSE 0 END)), 2)
            ELSE 0
        END AS win_rate
    FROM trades
    WHERE deleted_at IS NULL
      AND entry_date BETWEEN p_start_date AND p_end_date;
END$$

DELIMITER ;

-- ============================================
-- 프로시저 생성 확인
-- ============================================

SELECT 
    ROUTINE_NAME,
    ROUTINE_TYPE,
    DTD_IDENTIFIER AS return_type,
    ROUTINE_DEFINITION
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'trading_journal'
ORDER BY ROUTINE_TYPE, ROUTINE_NAME;

-- 완료 메시지
SELECT 'Stored procedures created successfully!' AS message;
