-- ============================================
-- 07_insert_initial_data.sql
-- 설명: 초기 데이터 삽입 (테스트/개발용)
-- 실행 순서: 7번째
-- 전제조건: 02_create_tables.sql 실행 완료
-- 주의: 운영 환경에서는 실행하지 마세요!
-- ============================================

USE trading_journal;

-- ============================================
-- 샘플 매매 데이터 삽입
-- ============================================

-- 샘플 1: 청산 완료 (수익)
INSERT INTO trades (symbol, entry_price, quantity, fee, reason, entry_date, exit_price, exit_date)
VALUES (
    'AAPL',
    150.00,
    10,
    1.50,
    '기술적 분석: 이동평균선 골든크로스 발생',
    '2024-01-15 10:30:00',
    155.00,
    '2024-01-20 15:45:00'
);

-- 샘플 2: 청산 완료 (손실)
INSERT INTO trades (symbol, entry_price, quantity, fee, reason, entry_date, exit_price, exit_date)
VALUES (
    'TSLA',
    200.00,
    5,
    1.00,
    '뉴스 기반: 신제품 발표 기대',
    '2024-01-16 09:00:00',
    195.00,
    '2024-01-18 14:00:00'
);

-- 샘플 3: 진행 중 (미청산)
INSERT INTO trades (symbol, entry_price, quantity, fee, reason, entry_date)
VALUES (
    'MSFT',
    380.00,
    8,
    1.20,
    '펀더멘털 분석: 실적 발표 예정',
    '2024-01-22 11:00:00'
);

-- 샘플 4: 청산 완료 (수익)
INSERT INTO trades (symbol, entry_price, quantity, fee, reason, entry_date, exit_price, exit_date)
VALUES (
    '005930',
    75000.00,
    20,
    150.00,
    '삼성전자 반도체 업황 개선 기대',
    '2024-01-10 09:30:00',
    77000.00,
    '2024-01-25 14:30:00'
);

-- 샘플 5: 진행 중 (미청산)
INSERT INTO trades (symbol, entry_price, quantity, fee, reason, entry_date)
VALUES (
    '035420',
    50000.00,
    15,
    75.00,
    'NAVER 광고 매출 증가 전망',
    '2024-01-23 10:15:00'
);

-- 샘플 6: 청산 완료 (손실)
INSERT INTO trades (symbol, entry_price, quantity, fee, reason, entry_date, exit_price, exit_date)
VALUES (
    'GOOGL',
    140.00,
    12,
    1.40,
    'AI 기술 발전에 따른 성장 기대',
    '2024-01-12 13:00:00',
    138.00,
    '2024-01-19 16:00:00'
);

-- 샘플 7: 청산 완료 (수익)
INSERT INTO trades (symbol, entry_price, quantity, fee, reason, entry_date, exit_price, exit_date)
VALUES (
    'NVDA',
    500.00,
    6,
    3.00,
    'GPU 수요 증가, AI 붐',
    '2024-01-08 10:00:00',
    520.00,
    '2024-01-17 15:30:00'
);

-- 샘플 8: 진행 중 (미청산)
INSERT INTO trades (symbol, entry_price, quantity, fee, reason, entry_date)
VALUES (
    'AMZN',
    175.00,
    10,
    1.75,
    '클라우드 사업 성장 지속',
    '2024-01-24 14:00:00'
);

-- ============================================
-- 삽입된 데이터 확인
-- ============================================

-- 전체 매매 조회
SELECT 
    trade_id,
    symbol,
    entry_price,
    quantity,
    fee,
    entry_date,
    exit_price,
    exit_date,
    CASE 
        WHEN exit_price IS NOT NULL THEN
            (exit_price * quantity) - (entry_price * quantity) - fee
        ELSE NULL
    END AS realized_pnl
FROM trades
ORDER BY entry_date DESC;

-- 통계 확인
SELECT * FROM v_trade_statistics;

-- 종목별 통계 확인
SELECT * FROM v_trades_by_symbol;

-- 완료 메시지
SELECT 'Initial data inserted successfully!' AS message;
SELECT CONCAT('Total trades inserted: ', COUNT(*)) AS count FROM trades;
