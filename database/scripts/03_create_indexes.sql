-- ============================================
-- 03_create_indexes.sql
-- 설명: 인덱스 생성
-- 실행 순서: 3번째
-- 전제조건: 02_create_tables.sql 실행 완료
-- ============================================

USE trading_journal;

-- ============================================
-- trades 테이블 인덱스
-- ============================================

-- 인덱스 1: 종목별 조회
CREATE INDEX idx_trades_symbol 
ON trades(symbol)
COMMENT '종목별 조회 최적화';

-- 인덱스 2: 기간별 조회
CREATE INDEX idx_trades_entry_date 
ON trades(entry_date)
COMMENT '기간별 조회 최적화';

-- 인덱스 3: 논리 삭제 필터링
CREATE INDEX idx_trades_deleted_at 
ON trades(deleted_at)
COMMENT '활성 매매 필터링 최적화';

-- 인덱스 4: 종목 + 기간 복합 조회 (가장 빈번한 쿼리)
CREATE INDEX idx_trades_symbol_entry_date 
ON trades(symbol, entry_date)
COMMENT '종목별 기간 조회 최적화';

-- 인덱스 5: 청산 여부 조회
CREATE INDEX idx_trades_exit_price 
ON trades(exit_price)
COMMENT '청산 완료 매매 조회 최적화';

-- 인덱스 6: 손익 계산 커버링 인덱스 (선택적)
-- 주의: 인덱스 크기가 크므로 필요 시에만 생성
/*
CREATE INDEX idx_trades_pnl_covering 
ON trades(exit_price, trade_id, symbol, entry_price, quantity, fee, deleted_at)
COMMENT '손익 계산 쿼리 커버링 인덱스';
*/

-- ============================================
-- 인덱스 생성 확인
-- ============================================

SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX,
    CARDINALITY,
    INDEX_TYPE,
    INDEX_COMMENT
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'trading_journal'
  AND TABLE_NAME = 'trades'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- 인덱스 크기 확인
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    ROUND(STAT_VALUE * @@innodb_page_size / 1024 / 1024, 2) AS index_size_mb
FROM mysql.innodb_index_stats
WHERE database_name = 'trading_journal'
  AND TABLE_NAME = 'trades'
  AND STAT_NAME = 'size'
ORDER BY index_size_mb DESC;

-- 완료 메시지
SELECT 'Indexes created successfully!' AS message;
