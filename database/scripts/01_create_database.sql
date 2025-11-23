-- ============================================
-- 01_create_database.sql
-- 설명: trading_journal 데이터베이스 생성
-- 실행 순서: 1번째
-- ============================================

-- 기존 데이터베이스 삭제 (주의: 개발 환경에서만 사용)
-- DROP DATABASE IF EXISTS trading_journal;

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS trading_journal
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci
    COMMENT '매매 일지 관리 시스템';

-- 데이터베이스 선택
USE trading_journal;

-- 데이터베이스 정보 확인
SELECT 
    SCHEMA_NAME AS database_name,
    DEFAULT_CHARACTER_SET_NAME AS charset,
    DEFAULT_COLLATION_NAME AS collation
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = 'trading_journal';

-- 완료 메시지
SELECT 'Database trading_journal created successfully!' AS message;
