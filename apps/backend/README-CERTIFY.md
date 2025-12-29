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

### 2. 환경변수 설정 (선택사항 - S3 사용 시)

`.env` 파일에 다음 변수 추가:

```env
# AWS S3 설정 (이미지 업로드용)
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=ppopgipang-uploads
```

**참고**: 현재는 S3 SDK가 설치되어 있지 않습니다. 실제 S3 사용을 위해서는:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

그리고 `apps/backend/src/commons/uploads.service.ts`의 TODO 주석 부분을 활성화하세요.

## 📁 구현된 파일 구조

```
apps/backend/src/
├── certifications/
│   ├── entities/
│   │   ├── certification.entity.ts           # ✅ 업데이트됨 (comment, rating 추가)
│   │   ├── loot-tag.entity.ts                # ✅ 신규
│   │   ├── loot-comment-preset.entity.ts     # ✅ 신규
│   │   └── checkin-reason-preset.entity.ts   # ✅ 신규
│   ├── dto/
│   │   ├── create-loot.dto.ts                # ✅ 신규
│   │   ├── create-checkin.dto.ts             # ✅ 신규
│   │   └── certification-rewards.dto.ts       # ✅ 신규
│   ├── seeds/
│   │   └── seed-presets.ts                   # ✅ 신규 (초기 데이터)
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
    ├── dto/
    │   └── upload-request.dto.ts             # ✅ 신규
    ├── uploads.service.ts                    # ✅ 신규
    ├── commons.controller.ts                 # ✅ 업데이트됨
    └── commons.module.ts                     # ✅ 업데이트됨
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

### 3. 득템 인증 생성
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
  "photoKeys": ["certifications/2025/12/uuid1.jpg", "certifications/2025/12/uuid2.jpg"],
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

### 4. 체크인 인증 생성
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

### 5. 이미지 업로드 URL 발급
```
POST /v1/commons/uploads/certification
Authorization: Bearer {token}
```

**Request:**
```json
{
  "fileCount": 2,
  "contentTypes": ["image/jpeg", "image/png"]
}
```

**Response:**
```json
{
  "uploads": [
    {
      "key": "certifications/2025/12/uuid1.jpg",
      "uploadUrl": "https://...",
      "expiresIn": 3600
    },
    {
      "key": "certifications/2025/12/uuid2.jpg",
      "uploadUrl": "https://...",
      "expiresIn": 3600
    }
  ]
}
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

#### 3. 득템 인증 (로그인 필요)
```bash
curl -X POST "http://localhost:3000/v1/certifications/loot" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": 1,
    "photoKeys": ["test.jpg"],
    "tagIds": [1],
    "comment": "테스트 득템"
  }'
```

## ⚠️ 주의사항

1. **DB 컬럼 추가 확인**: 기존 `certifications` 테이블에 `comment`, `rating` 컬럼이 추가되었는지 확인하세요.

2. **외래키 제약**: `certification_tags`, `certification_reasons` 테이블은 `certifications`, `loot_tags`, `checkin_reason_presets` 테이블에 의존합니다.

3. **S3 설정**: 실제 S3를 사용하려면 AWS SDK 설치 및 환경변수 설정이 필요합니다. 현재는 목(mock) URL을 반환합니다.

4. **인증 필수**: 인증 생성 및 업로드 URL 발급은 JWT 토큰이 필요합니다.

## 📝 다음 단계

- [ ] AWS S3 SDK 설치 및 실제 Presigned URL 구현
- [ ] 프론트엔드 페이지 구현
- [ ] E2E 테스트 작성
- [ ] 성능 최적화 (캐싱, 인덱스)

## 🐛 트러블슈팅

### 문제: "Table doesn't exist" 에러
**해결**: 마이그레이션 SQL을 실행하세요.

### 문제: 외래키 제약 위반
**해결**: 부모 테이블(`certifications`, `loot_tags` 등)이 먼저 생성되었는지 확인하세요.

### 문제: S3 업로드 실패
**해결**: `uploads.service.ts`의 TODO 주석을 확인하고 AWS SDK를 설치하세요.

## 📞 문의

구현 관련 문의사항은 이슈로 남겨주세요.
