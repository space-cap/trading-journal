-- ============================================
-- 02_create_tables.sql
-- 설명: trading_journal 테이블 생성
-- 실행 순서: 2번째
-- 전제조건: 01_create_database.sql 실행 완료
-- ============================================

USE trading_journal;

-- ============================================
-- 테이블: trades
-- 설명: 주식 매매 거래 기록
-- ============================================

CREATE TABLE IF NOT EXISTS trades (
    -- 기본키
    trade_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '매매 고유 식별자',
    
    -- 매매 정보
    symbol VARCHAR(20) NOT NULL COMMENT '종목 코드 (예: 005930, AAPL)',
    entry_price DECIMAL(15,2) NOT NULL COMMENT '진입 가격 (매수 체결가)',
    quantity INT UNSIGNED NOT NULL COMMENT '수량 (주식 수)',
    fee DECIMAL(10,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '거래 수수료',
    reason VARCHAR(500) NOT NULL COMMENT '매매 근거 및 전략',
    entry_date DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '진입 일시 (밀리초 포함)',
    
    -- 청산 정보 (선택)
    exit_price DECIMAL(15,2) NULL COMMENT '청산 가격 (매도 체결가)',
    exit_date DATETIME(3) NULL COMMENT '청산 일시 (밀리초 포함)',
    
    -- 메타데이터
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '레코드 생성 일시',
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '레코드 수정 일시',
    deleted_at DATETIME(3) NULL COMMENT '논리 삭제 일시 (Soft Delete)',
    
    -- 제약조건
    CONSTRAINT pk_trades PRIMARY KEY (trade_id),
    CONSTRAINT chk_trades_entry_price CHECK (entry_price > 0),
    CONSTRAINT chk_trades_quantity CHECK (quantity > 0),
    CONSTRAINT chk_trades_fee CHECK (fee >= 0),
    CONSTRAINT chk_trades_exit_price CHECK (exit_price IS NULL OR exit_price > 0),
    CONSTRAINT chk_trades_exit_date CHECK (exit_date IS NULL OR exit_date > entry_date),
    CONSTRAINT chk_trades_symbol_length CHECK (CHAR_LENGTH(symbol) > 0),
    CONSTRAINT chk_trades_reason_length CHECK (CHAR_LENGTH(reason) > 0),
    CONSTRAINT chk_trades_exit_consistency CHECK (
        (exit_price IS NULL AND exit_date IS NULL) OR
        (exit_price IS NOT NULL AND exit_date IS NOT NULL)
    )
    
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='주식 매매 거래 기록 테이블'
  ROW_FORMAT=DYNAMIC;

-- ============================================
-- 테이블: users (Phase 2 - 향후 확장용)
-- 설명: 시스템 사용자 계정
-- 참고: 현재는 생성하지 않음, 필요 시 주석 해제
-- ============================================

/*
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '사용자 고유 식별자',
    email VARCHAR(100) NOT NULL COMMENT '이메일 주소 (로그인 ID)',
    password VARCHAR(255) NOT NULL COMMENT '암호화된 비밀번호 (BCrypt)',
    name VARCHAR(50) NOT NULL COMMENT '사용자 이름',
    joined_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '가입 일시',
    last_login_at DATETIME(3) NULL COMMENT '최근 로그인 일시',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '레코드 생성 일시',
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '레코드 수정 일시',
    deleted_at DATETIME(3) NULL COMMENT '논리 삭제 일시',
    
    CONSTRAINT pk_users PRIMARY KEY (user_id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT chk_users_email_format CHECK (email LIKE '%@%'),
    CONSTRAINT chk_users_name_length CHECK (CHAR_LENGTH(name) > 0)
    
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='시스템 사용자 계정 테이블'
  ROW_FORMAT=DYNAMIC;

-- trades 테이블에 user_id 외래키 추가
ALTER TABLE trades 
ADD COLUMN user_id BIGINT UNSIGNED NOT NULL COMMENT '사용자 ID (외래키)' 
AFTER trade_id;

ALTER TABLE trades
ADD CONSTRAINT fk_trades_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
*/

-- 테이블 생성 확인
SELECT 
    TABLE_NAME,
    ENGINE,
    TABLE_ROWS,
    AVG_ROW_LENGTH,
    DATA_LENGTH,
    INDEX_LENGTH,
    TABLE_COLLATION,
    TABLE_COMMENT
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'trading_journal'
ORDER BY TABLE_NAME;

-- 완료 메시지
SELECT 'Tables created successfully!' AS message;
