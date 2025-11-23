-- ============================================
-- 04_create_views.sql
-- 설명: 뷰 생성
-- 실행 순서: 4번째
-- 전제조건: 02_create_tables.sql 실행 완료
-- ============================================

USE trading_journal;

-- ============================================
-- 뷰 1: v_active_trades
-- 설명: 논리 삭제되지 않은 활성 매매만 조회
-- ============================================

CREATE OR REPLACE VIEW v_active_trades AS
SELECT 
    trade_id,
    symbol,
    entry_price,
    quantity,
    fee,
    reason,
    entry_date,
    exit_price,
    exit_date,
    -- 계산 속성: 실현 손익
    CASE 
        WHEN exit_price IS NOT NULL THEN
            (exit_price * quantity) - (entry_price * quantity) - fee
        ELSE NULL
    END AS realized_pnl,
    -- 계산 속성: 투자 금액
    entry_price * quantity AS investment_amount,
    -- 계산 속성: 수익률 (%)
    CASE 
        WHEN exit_price IS NOT NULL THEN
            ROUND((((exit_price * quantity) - (entry_price * quantity) - fee) / (entry_price * quantity)) * 100, 2)
        ELSE NULL
    END AS return_rate,
    created_at,
    updated_at
FROM trades
WHERE deleted_at IS NULL;

-- ============================================
-- 뷰 2: v_closed_trades
-- 설명: 청산 완료된 매매만 조회
-- ============================================

CREATE OR REPLACE VIEW v_closed_trades AS
SELECT 
    trade_id,
    symbol,
    entry_price,
    quantity,
    fee,
    reason,
    entry_date,
    exit_price,
    exit_date,
    -- 계산 속성: 실현 손익
    (exit_price * quantity) - (entry_price * quantity) - fee AS realized_pnl,
    -- 계산 속성: 투자 금액
    entry_price * quantity AS investment_amount,
    -- 계산 속성: 수익률 (%)
    ROUND((((exit_price * quantity) - (entry_price * quantity) - fee) / (entry_price * quantity)) * 100, 2) AS return_rate,
    -- 계산 속성: 보유 기간 (일)
    DATEDIFF(exit_date, entry_date) AS holding_days,
    created_at,
    updated_at
FROM trades
WHERE deleted_at IS NULL
  AND exit_price IS NOT NULL
  AND exit_date IS NOT NULL;

-- ============================================
-- 뷰 3: v_open_trades
-- 설명: 진행 중인 매매만 조회 (미청산)
-- ============================================

CREATE OR REPLACE VIEW v_open_trades AS
SELECT 
    trade_id,
    symbol,
    entry_price,
    quantity,
    fee,
    reason,
    entry_date,
    -- 계산 속성: 투자 금액
    entry_price * quantity AS investment_amount,
    -- 계산 속성: 보유 기간 (일)
    DATEDIFF(CURRENT_TIMESTAMP, entry_date) AS holding_days,
    created_at,
    updated_at
FROM trades
WHERE deleted_at IS NULL
  AND exit_price IS NULL
  AND exit_date IS NULL;

-- ============================================
-- 뷰 4: v_trade_statistics
-- 설명: 매매 통계 요약
-- ============================================

CREATE OR REPLACE VIEW v_trade_statistics AS
SELECT 
    -- 전체 통계
    COUNT(*) AS total_trades,
    SUM(CASE WHEN exit_price IS NOT NULL THEN 1 ELSE 0 END) AS closed_trades,
    SUM(CASE WHEN exit_price IS NULL THEN 1 ELSE 0 END) AS open_trades,
    
    -- 손익 통계
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
    
    -- 승패 통계
    SUM(CASE 
        WHEN exit_price IS NOT NULL AND (exit_price * quantity) - (entry_price * quantity) - fee > 0 THEN 1
        ELSE 0
    END) AS winning_trades,
    
    SUM(CASE 
        WHEN exit_price IS NOT NULL AND (exit_price * quantity) - (entry_price * quantity) - fee <= 0 THEN 1
        ELSE 0
    END) AS losing_trades,
    
    -- 승률 (%)
    CASE 
        WHEN SUM(CASE WHEN exit_price IS NOT NULL THEN 1 ELSE 0 END) > 0 THEN
            ROUND((SUM(CASE 
                WHEN exit_price IS NOT NULL AND (exit_price * quantity) - (entry_price * quantity) - fee > 0 THEN 1
                ELSE 0
            END) * 100.0 / SUM(CASE WHEN exit_price IS NOT NULL THEN 1 ELSE 0 END)), 2)
        ELSE 0
    END AS win_rate
FROM trades
WHERE deleted_at IS NULL;

-- ============================================
-- 뷰 5: v_trades_by_symbol
-- 설명: 종목별 매매 통계
-- ============================================

CREATE OR REPLACE VIEW v_trades_by_symbol AS
SELECT 
    symbol,
    COUNT(*) AS trade_count,
    SUM(CASE WHEN exit_price IS NOT NULL THEN 1 ELSE 0 END) AS closed_count,
    SUM(CASE WHEN exit_price IS NULL THEN 1 ELSE 0 END) AS open_count,
    SUM(CASE 
        WHEN exit_price IS NOT NULL THEN
            (exit_price * quantity) - (entry_price * quantity) - fee
        ELSE 0
    END) AS total_pnl,
    AVG(CASE 
        WHEN exit_price IS NOT NULL THEN
            (exit_price * quantity) - (entry_price * quantity) - fee
        ELSE NULL
    END) AS avg_pnl
FROM trades
WHERE deleted_at IS NULL
GROUP BY symbol
ORDER BY total_pnl DESC;

-- ============================================
-- 뷰 생성 확인
-- ============================================

SELECT 
    TABLE_NAME AS view_name,
    VIEW_DEFINITION
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'trading_journal'
ORDER BY TABLE_NAME;

-- 완료 메시지
SELECT 'Views created successfully!' AS message;
