# CHANGELOG

Trading Journal 프로젝트의 모든 주요 변경 사항을 기록합니다.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 따르며,
이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 준수합니다.

---

## [Unreleased]

### 계획 중
- 사용자 인증 및 권한 관리
- 고급 필터링 및 검색 기능
- 통계 및 분석 기능 강화

---

## [0.2.0] - 2025-11-26

### Added
- **다국어 지원 (i18n)**
  - react-i18next 라이브러리 통합
  - 한글/영문 번역 리소스 파일 작성 (약 30개 번역 키)
  - 언어 토글 버튼 UI 컴포넌트 (`LanguageToggle.tsx`)
  - 로컬 스토리지 기반 언어 설정 저장 및 불러오기
  - 모든 UI 컴포넌트에 번역 적용 (App, TradeForm, TradeList, DashboardChart)

### Changed
- 앱 제목이 선택한 언어에 따라 "매매 일지" 또는 "Trading Journal"로 표시
- 모든 하드코딩된 텍스트를 번역 키로 변경

### Technical
- 새 파일: `i18n.ts`, `locales/ko.json`, `locales/en.json`, `components/LanguageToggle.tsx`
- 수정 파일: `main.tsx`, `App.tsx`, `TradeForm.tsx`, `TradeList.tsx`, `DashboardChart.tsx`

**상세 내용**: [changelogs/2025-11-26_다국어지원.md](changelogs/2025-11-26_다국어지원.md)

---

## [0.1.0] - 2025-11-23

### Added
- **프로젝트 초기 설정**
  - Spring Boot 백엔드 프로젝트 생성 (Kotlin + Gradle)
  - React 프론트엔드 프로젝트 생성 (TypeScript + Vite)
  - 모노레포 구조 설정
  - `.gitignore` 파일 생성

- **데이터베이스 설계 및 구현**
  - 요구사항 분석 문서 작성
  - 개념적/논리적/물리적 데이터 모델링
  - MySQL 스크립트 9개 파일 생성
    - 데이터베이스, 테이블, 인덱스, 뷰, 트리거, 저장 프로시저
    - 샘플 데이터 및 롤백 스크립트

- **백엔드 API 개발**
  - Trade 엔티티 설계 (JPA)
  - TradeRepository, TradeService, TradeController 구현
  - REST API 엔드포인트 (CRUD)
  - 프로파일 기반 환경 설정 (dev/prod)
  - Swagger UI 통합
  - H2 Console 활성화

- **프론트엔드 UI 개발**
  - TradeForm 컴포넌트 (매매 입력 폼)
  - TradeList 컴포넌트 (매매 목록 테이블)
  - DashboardChart 컴포넌트 (누적 손익 차트)
  - TailwindCSS 스타일링
  - Vite Proxy 설정 (CORS 해결)

- **통합 및 테스트**
  - 백엔드/프론트엔드 서버 실행 검증
  - E2E 시나리오 테스트

### Features
- ✅ 매매 기록 CRUD (생성, 조회, 수정, 삭제)
- ✅ 실현 손익 자동 계산
- ✅ 대시보드 차트 시각화 (누적 손익)
- ✅ H2 인메모리 데이터베이스 (개발용)
- ✅ MySQL 스크립트 (운영용)

### Documentation
- README.md 작성
- 개발계획서.md 작성
- 데이터베이스 설계 문서 5개 작성
- 구현리포트.md 작성
- 작업이력.md 작성

---

## 버전 정의

- **MAJOR**: 호환되지 않는 API 변경
- **MINOR**: 이전 버전과 호환되는 기능 추가
- **PATCH**: 이전 버전과 호환되는 버그 수정

---

**프로젝트 시작일**: 2025-11-23  
**최종 업데이트**: 2025-11-26
