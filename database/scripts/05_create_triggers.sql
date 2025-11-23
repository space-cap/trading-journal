-- ============================================
-- 05_create_triggers.sql
-- 설명: 트리거 생성
-- 실행 순서: 5번째
-- 전제조건: 02_create_tables.sql 실행 완료
-- ============================================

USE trading_journal;

-- ============================================
-- 트리거 1: trg_trades_before_insert
-- 설명: INSERT 전 데이터 검증 및 자동 설정
-- ============================================

DELIMITER $$

CREATE TRIGGER trg_trades_before_insert
BEFORE INSERT ON trades
FOR EACH ROW
BEGIN
    -- 종목 코드 공백 제거 및 대문자 변환
    SET NEW.symbol = UPPER(TRIM(NEW.symbol));
    
    -- 매매 근거 공백 제거
    SET NEW.reason = TRIM(NEW.reason);
    
    -- entry_date가 미래 날짜인 경우 현재 시각으로 설정
    IF NEW.entry_date > CURRENT_TIMESTAMP(3) THEN
        SET NEW.entry_date = CURRENT_TIMESTAMP(3);
    END IF;
    
    -- 수수료가 NULL인 경우 0으로 설정
    IF NEW.fee IS NULL THEN
        SET NEW.fee = 0.00;
    END IF;
END$$

DELIMITER ;

-- ============================================
-- 트리거 2: trg_trades_before_update
-- 설명: UPDATE 전 데이터 검증
-- ============================================

DELIMITER $$

CREATE TRIGGER trg_trades_before_update
BEFORE UPDATE ON trades
FOR EACH ROW
BEGIN
    -- 종목 코드 공백 제거 및 대문자 변환
    SET NEW.symbol = UPPER(TRIM(NEW.symbol));
    
    -- 매매 근거 공백 제거
    SET NEW.reason = TRIM(NEW.reason);
    
    -- 삭제된 레코드는 수정 불가 (deleted_at이 NULL이 아닌 경우)
    IF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '삭제된 매매는 수정할 수 없습니다.';
    END IF;
    
    -- 진입 정보는 수정 불가 (보안 강화)
    IF OLD.entry_price != NEW.entry_price OR 
       OLD.quantity != NEW.quantity OR 
       OLD.entry_date != NEW.entry_date THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '진입 정보(가격, 수량, 일시)는 수정할 수 없습니다.';
    END IF;
    
    -- 청산 일시가 진입 일시보다 이전인 경우 에러
    IF NEW.exit_date IS NOT NULL AND NEW.exit_date <= OLD.entry_date THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '청산 일시는 진입 일시보다 이후여야 합니다.';
    END IF;
END$$

DELIMITER ;

-- ============================================
-- 트리거 3: trg_trades_after_insert
-- 설명: INSERT 후 로그 기록 (선택적)
-- 참고: 감사 로그 테이블이 있는 경우 활성화
-- ============================================

/*
DELIMITER $$

CREATE TRIGGER trg_trades_after_insert
AFTER INSERT ON trades
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (
        table_name,
        operation,
        record_id,
        user_id,
        created_at
    ) VALUES (
        'trades',
        'INSERT',
        NEW.trade_id,
        @current_user_id,
        CURRENT_TIMESTAMP(3)
    );
END$$

DELIMITER ;
*/

-- ============================================
-- 트리거 4: trg_trades_after_update
-- 설명: UPDATE 후 로그 기록 (선택적)
-- ============================================

/*
DELIMITER $$

CREATE TRIGGER trg_trades_after_update
AFTER UPDATE ON trades
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (
        table_name,
        operation,
        record_id,
        user_id,
        old_value,
        new_value,
        created_at
    ) VALUES (
        'trades',
        'UPDATE',
        NEW.trade_id,
        @current_user_id,
        JSON_OBJECT(
            'exit_price', OLD.exit_price,
            'exit_date', OLD.exit_date,
            'deleted_at', OLD.deleted_at
        ),
        JSON_OBJECT(
            'exit_price', NEW.exit_price,
            'exit_date', NEW.exit_date,
            'deleted_at', NEW.deleted_at
        ),
        CURRENT_TIMESTAMP(3)
    );
END$$

DELIMITER ;
*/

-- ============================================
-- 트리거 생성 확인
-- ============================================

SELECT 
    TRIGGER_NAME,
    EVENT_MANIPULATION,
    EVENT_OBJECT_TABLE,
    ACTION_TIMING,
    ACTION_STATEMENT
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'trading_journal'
ORDER BY EVENT_OBJECT_TABLE, ACTION_TIMING, EVENT_MANIPULATION;

-- 완료 메시지
SELECT 'Triggers created successfully!' AS message;
