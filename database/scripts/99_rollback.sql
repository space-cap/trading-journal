-- ============================================
-- 99_rollback.sql
-- 설명: 데이터베이스 롤백 (모든 객체 삭제)
-- 주의: 이 스크립트는 모든 데이터를 삭제합니다!
-- 운영 환경에서는 절대 실행하지 마세요!
-- ============================================

USE trading_journal;

-- ============================================
-- 경고 메시지
-- ============================================

SELECT '⚠️  WARNING: This script will DELETE ALL database objects!' AS warning;
SELECT '⚠️  Press Ctrl+C to cancel within 5 seconds...' AS warning;

-- 5초 대기 (MySQL에서는 SLEEP 함수 사용)
DO SLEEP(5);

-- ============================================
-- 1단계: 저장 프로시저 삭제
-- ============================================

DROP PROCEDURE IF EXISTS sp_close_trade;
DROP PROCEDURE IF EXISTS sp_soft_delete_trade;
DROP PROCEDURE IF EXISTS sp_restore_trade;
DROP PROCEDURE IF EXISTS sp_get_trade_statistics;

SELECT 'Stored procedures dropped.' AS message;

-- ============================================
-- 2단계: 트리거 삭제
-- ============================================

DROP TRIGGER IF EXISTS trg_trades_before_insert;
DROP TRIGGER IF EXISTS trg_trades_before_update;
DROP TRIGGER IF EXISTS trg_trades_after_insert;
DROP TRIGGER IF EXISTS trg_trades_after_update;

SELECT 'Triggers dropped.' AS message;

-- ============================================
-- 3단계: 뷰 삭제
-- ============================================

DROP VIEW IF EXISTS v_active_trades;
DROP VIEW IF EXISTS v_closed_trades;
DROP VIEW IF EXISTS v_open_trades;
DROP VIEW IF EXISTS v_trade_statistics;
DROP VIEW IF EXISTS v_trades_by_symbol;

SELECT 'Views dropped.' AS message;

-- ============================================
-- 4단계: 테이블 삭제
-- ============================================

-- 외래키가 있는 경우 먼저 삭제
-- ALTER TABLE trades DROP FOREIGN KEY IF EXISTS fk_trades_user;

-- 테이블 삭제
DROP TABLE IF EXISTS trades;
DROP TABLE IF EXISTS users;

SELECT 'Tables dropped.' AS message;

-- ============================================
-- 5단계: 데이터베이스 삭제 (선택적)
-- 주의: 아래 주석을 해제하면 데이터베이스 자체가 삭제됩니다!
-- ============================================

/*
DROP DATABASE IF EXISTS trading_journal;
SELECT 'Database dropped.' AS message;
*/

-- ============================================
-- 롤백 완료 확인
-- ============================================

-- 남아있는 테이블 확인
SELECT 
    TABLE_NAME,
    TABLE_TYPE
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'trading_journal'
ORDER BY TABLE_NAME;

-- 남아있는 뷰 확인
SELECT 
    TABLE_NAME AS view_name
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'trading_journal'
ORDER BY TABLE_NAME;

-- 남아있는 프로시저 확인
SELECT 
    ROUTINE_NAME,
    ROUTINE_TYPE
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'trading_journal'
ORDER BY ROUTINE_NAME;

-- 남아있는 트리거 확인
SELECT 
    TRIGGER_NAME,
    EVENT_OBJECT_TABLE
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'trading_journal'
ORDER BY TRIGGER_NAME;

-- 완료 메시지
SELECT '✅ Rollback completed successfully!' AS message;
SELECT 'All database objects have been removed.' AS message;
