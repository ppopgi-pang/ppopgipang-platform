# 뽑기팡 인증(Certify) 기능 - Backend 구현 가이드

## 📋 개요

사용자의 방문과 득템을 빠르게 기록하는 인증 기능입니다.

- **득템(Loot)**: 사진 업로드 + 태그 + 한줄평 → +50 EXP
- **체크인(Check-in)**: 상태 평가 + 이유 선택 → +10 EXP

## 🚀 설치 및 설정

### 1. DB 마이그레이션 실행

```bash
# MySQL 접속
mysql -u your_username -p your_database

# 마이그레이션 실행
source apps/backend/migrations/001-certify-feature.sql
```

### 2. 이미지 업로드 설정

기존 `/v1/commons/file-upload` 엔드포인트를 사용합니다. 업로드된 파일은 로컬 스토리지에 저장되며, 파일명이 반환됩니다.

## 📁 구현된 파일 구조

```
apps/backend/src/
├── certifications/
│   ├── entities/
│   │   ├── certification.entity.ts           # ✅ 업데이트됨 (comment, rating 추가)
│   │   ├── certification-photo.entity.ts     # ✅ 기존
│   │   ├── loot-like.entity.ts               # ✅ 기존
│   │   ├── loot-tag.entity.ts                # ✅ 신규
│   │   ├── loot-comment-preset.entity.ts     # ✅ 신규
│   │   └── checkin-reason-preset.entity.ts   # ✅ 신규
│   ├── certifications.controller.ts          # ✅ 업데이트됨
│   ├── certifications.service.ts             # ✅ 업데이트됨
│   └── certifications.module.ts              # ✅ 업데이트됨
├── gamification/
│   ├── gamification.service.ts               # ✅ 신규
│   └── gamification.module.ts                # ✅ 업데이트됨
├── stores/
│   ├── stores.controller.ts                  # ✅ 업데이트됨 (nearest 엔드포인트 추가)
│   └── stores.service.ts                     # ✅ 업데이트됨
└── commons/
    ├── commons.controller.ts                 # ✅ file-upload 사용
    └── commons.module.ts                     # ✅ 기존

packages/types/src/dto/certification/
├── certification-input.dto.ts                # ✅ 신규 (CertificationInput namespace)
└── certification-result.dto.ts               # ✅ 업데이트됨 (Rewards DTOs 추가)

apps/backend/migrations/
└── 001-certify-feature.sql                   # ✅ 신규 (DB 스키마 + 시드 데이터)
```

## 🔌 API 엔드포인트

### 1. 가장 가까운 가게 조회
```
GET /v1/stores/nearest?latitude={lat}&longitude={lng}&radius={radius}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "뽑기팡 홍대점",
    "address": "서울시 마포구...",
    "latitude": 37.5665,
    "longitude": 126.9780,
    "distance": 50,
    "thumbnailUrl": "...",
    "category": "뽑기"
  }
}
```

### 2. 프리셋 조회
```
GET /v1/certifications/presets
```

**Response:**
```json
{
  "tags": [
    { "id": 1, "name": "인형", "iconName": null }
  ],
  "lootComments": [
    { "id": 1, "content": "집게 힘이 좋아요" }
  ],
  "checkinReasons": [
    { "id": 1, "content": "기계 세팅이 어려워요" }
  ]
}
```

### 3. 이미지 업로드
```
POST /v1/commons/file-upload
Content-Type: multipart/form-data
```

**Request:**
- `file`: 이미지 파일 (multipart/form-data)

**Response:**
```json
{
  "fileName": "1735467890123-uuid.jpg"
}
```

### 4. 득템 인증 생성
```
POST /v1/certifications/loot
Authorization: Bearer {token}
```

**Request:**
```json
{
  "storeId": 1,
  "latitude": 37.5665,
  "longitude": 126.9780,
  "photoFileNames": ["1735467890123-uuid1.jpg", "1735467890123-uuid2.jpg"],
  "tagIds": [1, 2],
  "comment": "집게 힘이 좋아요"
}
```

**Response:**
```json
{
  "certificationId": 123,
  "type": "loot",
  "rewards": {
    "exp": 50,
    "totalExp": 250,
    "currentLevel": 3,
    "levelUp": false,
    "expToNextLevel": 50,
    "newStamp": {
      "id": 5,
      "imageName": "stamp_hongdae.png",
      "storeName": "뽑기팡 홍대점"
    },
    "newBadges": []
  }
}
```

### 5. 체크인 인증 생성
```
POST /v1/certifications/checkin
Authorization: Bearer {token}
```

**Request:**
```json
{
  "storeId": 1,
  "latitude": 37.5665,
  "longitude": 126.9780,
  "rating": "good",
  "reasonIds": [1, 3]
}
```

**Response:**
```json
{
  "certificationId": 124,
  "type": "checkin",
  "rewards": {
    "exp": 10,
    "totalExp": 260,
    "currentLevel": 3,
    "levelUp": false,
    "expToNextLevel": 40
  }
}
```

## 📝 이미지 업로드 플로우

득템 인증을 위한 이미지 업로드는 다음과 같은 절차로 진행됩니다:

1. **이미지 업로드**: 클라이언트가 `POST /v1/commons/file-upload`로 이미지 파일을 전송 (multipart/form-data)
2. **파일명 수신**: 서버가 로컬 스토리지에 저장 후 파일명 반환 (예: `1735467890123-uuid.jpg`)
3. **인증 생성**: 받은 파일명을 `photoFileNames` 배열에 담아 `POST /v1/certifications/loot`로 전송

**예시:**
```bash
# 1단계: 이미지 업로드
curl -X POST "http://localhost:3000/v1/commons/file-upload" \
  -F "file=@photo1.jpg"
# 응답: { "fileName": "1735467890123-uuid1.jpg" }

curl -X POST "http://localhost:3000/v1/commons/file-upload" \
  -F "file=@photo2.jpg"
# 응답: { "fileName": "1735467890123-uuid2.jpg" }

# 2단계: 득템 인증 생성
curl -X POST "http://localhost:3000/v1/certifications/loot" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": 1,
    "photoFileNames": ["1735467890123-uuid1.jpg", "1735467890123-uuid2.jpg"],
    "tagIds": [1, 2],
    "comment": "집게 힘이 좋아요"
  }'
```

## 🎮 게이미피케이션 로직

### EXP & 레벨
- **득템**: +50 EXP
- **체크인**: +10 EXP
- **레벨 공식**: `Level = floor(totalExp / 100) + 1`

### 스탬프
- 각 가게 첫 방문 시 자동 지급

### 배지 조건
- `FIRST_LOOT`: 득템 인증 1회
- `FIRST_CHECKIN`: 체크인 인증 1회
- `LOOT_10`: 득템 인증 10회
- `VISIT_5_STORES`: 서로 다른 가게 5곳 방문
- `STREAK_7`: 7일 연속 인증

## 🧪 테스트

### 백엔드 서버 실행
```bash
cd apps/backend
npm run dev
```

### Swagger 문서 확인
```
http://localhost:3000/api
```

### cURL 테스트 예시

#### 1. 가까운 가게 찾기
```bash
curl -X GET "http://localhost:3000/v1/stores/nearest?latitude=37.5665&longitude=126.9780&radius=100"
```

#### 2. 프리셋 조회
```bash
curl -X GET "http://localhost:3000/v1/certifications/presets"
```

#### 3. 이미지 업로드
```bash
curl -X POST "http://localhost:3000/v1/commons/file-upload" \
  -F "file=@test.jpg"
```

#### 4. 득템 인증 (로그인 필요)
```bash
curl -X POST "http://localhost:3000/v1/certifications/loot" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": 1,
    "photoFileNames": ["1735467890123-uuid.jpg"],
    "tagIds": [1],
    "comment": "테스트 득템"
  }'
```

## ⚠️ 주의사항

1. **DB 컬럼 추가 확인**: 기존 `certifications` 테이블에 `comment`, `rating` 컬럼이 추가되었는지 확인하세요.

2. **외래키 제약**: `certification_tags`, `certification_reasons` 테이블은 `certifications`, `loot_tags`, `checkin_reason_presets` 테이블에 의존합니다.

3. **파일 업로드**: 이미지는 로컬 스토리지에 저장됩니다. 업로드된 파일의 저장 경로와 접근 권한을 확인하세요.

4. **인증 필수**: 득템/체크인 인증 생성은 JWT 토큰이 필요합니다.

5. **DTO 위치**: 모든 DTO는 `packages/types`에 위치하며, `CertificationInput` 및 `CertificationResult` namespace를 사용합니다.

## 📝 다음 단계

- [ ] 프론트엔드 페이지 구현
- [ ] E2E 테스트 작성
- [ ] 성능 최적화 (캐싱, 인덱스)
- [ ] 이미지 최적화 및 썸네일 생성

## 🐛 트러블슈팅

### 문제: "Table doesn't exist" 에러
**해결**: 마이그레이션 SQL을 실행하세요.

### 문제: 외래키 제약 위반
**해결**: 부모 테이블(`certifications`, `loot_tags` 등)이 먼저 생성되었는지 확인하세요.

### 문제: 파일 업로드 실패
**해결**: 업로드 디렉토리의 쓰기 권한을 확인하고, Multer 설정을 검토하세요.

## 📞 문의

구현 관련 문의사항은 이슈로 남겨주세요.
