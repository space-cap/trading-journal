# Trading Journal - 데이터베이스 스크립트

## 📋 개요

이 디렉토리에는 Trading Journal 프로젝트의 MySQL 데이터베이스를 생성하고 관리하기 위한 SQL 스크립트가 포함되어 있습니다.

---

## 📁 스크립트 파일 목록

| 파일명 | 설명 | 실행 순서 |
|--------|------|----------|
| **01_create_database.sql** | 데이터베이스 생성 | 1 |
| **02_create_tables.sql** | 테이블 생성 (trades, users) | 2 |
| **03_create_indexes.sql** | 인덱스 생성 (5개) | 3 |
| **04_create_views.sql** | 뷰 생성 (5개) | 4 |
| **05_create_triggers.sql** | 트리거 생성 (2개) | 5 |
| **06_create_procedures.sql** | 저장 프로시저 생성 (4개) | 6 |
| **07_insert_initial_data.sql** | 초기 샘플 데이터 삽입 | 7 |
| **99_rollback.sql** | 모든 객체 삭제 (롤백) | - |

---

## 🚀 실행 방법

### 방법 1: MySQL CLI에서 실행

```bash
# 1. MySQL 접속
mysql -u root -p

# 2. 스크립트 순서대로 실행
source /path/to/01_create_database.sql
source /path/to/02_create_tables.sql
source /path/to/03_create_indexes.sql
source /path/to/04_create_views.sql
source /path/to/05_create_triggers.sql
source /path/to/06_create_procedures.sql
source /path/to/07_insert_initial_data.sql
```

### 방법 2: 명령줄에서 직접 실행

```bash
# Windows (PowerShell)
Get-Content .\01_create_database.sql | mysql -u root -p
Get-Content .\02_create_tables.sql | mysql -u root -p
Get-Content .\03_create_indexes.sql | mysql -u root -p
Get-Content .\04_create_views.sql | mysql -u root -p
Get-Content .\05_create_triggers.sql | mysql -u root -p
Get-Content .\06_create_procedures.sql | mysql -u root -p
Get-Content .\07_insert_initial_data.sql | mysql -u root -p

# Linux/Mac
mysql -u root -p < 01_create_database.sql
mysql -u root -p < 02_create_tables.sql
mysql -u root -p < 03_create_indexes.sql
mysql -u root -p < 04_create_views.sql
mysql -u root -p < 05_create_triggers.sql
mysql -u root -p < 06_create_procedures.sql
mysql -u root -p < 07_insert_initial_data.sql
```

### 방법 3: 일괄 실행 스크립트

```bash
# Windows (PowerShell)
.\run_all.ps1

# Linux/Mac
./run_all.sh
```

---

## 📊 데이터베이스 구조

### 테이블

#### trades
주식 매매 거래 기록을 저장하는 메인 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| trade_id | BIGINT | 매매 고유 식별자 (PK) |
| symbol | VARCHAR(20) | 종목 코드 |
| entry_price | DECIMAL(15,2) | 진입 가격 |
| quantity | INT | 수량 |
| fee | DECIMAL(10,2) | 수수료 |
| reason | VARCHAR(500) | 매매 근거 |
| entry_date | DATETIME(3) | 진입 일시 |
| exit_price | DECIMAL(15,2) | 청산 가격 |
| exit_date | DATETIME(3) | 청산 일시 |
| created_at | DATETIME(3) | 생성 일시 |
| updated_at | DATETIME(3) | 수정 일시 |
| deleted_at | DATETIME(3) | 삭제 일시 |

### 인덱스

1. **idx_trades_symbol**: 종목별 조회 최적화
2. **idx_trades_entry_date**: 기간별 조회 최적화
3. **idx_trades_deleted_at**: 논리 삭제 필터링
4. **idx_trades_symbol_entry_date**: 종목+기간 복합 조회
5. **idx_trades_exit_price**: 청산 여부 조회

### 뷰

1. **v_active_trades**: 활성 매매 (논리 삭제 제외)
2. **v_closed_trades**: 청산 완료 매매
3. **v_open_trades**: 진행 중 매매 (미청산)
4. **v_trade_statistics**: 전체 매매 통계
5. **v_trades_by_symbol**: 종목별 매매 통계

### 트리거

1. **trg_trades_before_insert**: INSERT 전 데이터 검증
2. **trg_trades_before_update**: UPDATE 전 데이터 검증

### 저장 프로시저

1. **sp_close_trade**: 매매 청산 처리
2. **sp_soft_delete_trade**: 매매 논리 삭제
3. **sp_restore_trade**: 삭제된 매매 복원
4. **sp_get_trade_statistics**: 기간별 통계 조회

---

## 🔧 사용 예시

### 매매 청산

```sql
CALL sp_close_trade(1, 155.00, '2024-01-20 15:45:00');
```

### 매매 삭제

```sql
CALL sp_soft_delete_trade(1);
```

### 매매 복원

```sql
CALL sp_restore_trade(1);
```

### 기간별 통계 조회

```sql
CALL sp_get_trade_statistics('2024-01-01', '2024-01-31');
```

### 활성 매매 조회

```sql
SELECT * FROM v_active_trades;
```

### 청산 완료 매매 조회

```sql
SELECT * FROM v_closed_trades;
```

### 전체 통계 조회

```sql
SELECT * FROM v_trade_statistics;
```

---

## ⚠️ 주의사항

### 운영 환경

- **07_insert_initial_data.sql**: 샘플 데이터이므로 운영 환경에서 실행하지 마세요
- **99_rollback.sql**: 모든 데이터를 삭제하므로 운영 환경에서 절대 실행하지 마세요

### 백업

- 중요한 작업 전에는 반드시 백업을 수행하세요
- 롤백 스크립트 실행 전 데이터를 백업하세요

### 권한

- 스크립트 실행을 위해서는 적절한 MySQL 권한이 필요합니다
- CREATE, DROP, ALTER 권한이 필요합니다

---

## 🔄 롤백 (모든 객체 삭제)

```bash
# 주의: 모든 데이터가 삭제됩니다!
mysql -u root -p < 99_rollback.sql
```

---

## 📚 참고 문서

- [1단계_요구사항_분석_상세.md](../../docs/1단계_요구사항_분석_상세.md)
- [2단계_개념적_데이터_모델링.md](../../docs/2단계_개념적_데이터_모델링.md)
- [3단계_논리적_데이터_모델링.md](../../docs/3단계_논리적_데이터_모델링.md)
- [4단계_물리적_데이터_모델링.md](../../docs/4단계_물리적_데이터_모델링.md)

---

## 📝 버전 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0 | 2025-11-23 | Database Team | 초안 작성 |

---

**작성일**: 2025-11-23  
**데이터베이스**: trading_journal  
**DBMS**: MySQL 8.0+
