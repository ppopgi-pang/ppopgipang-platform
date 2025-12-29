-- ========================================
-- 뽑기팡 인증(Certify) 기능 DB 마이그레이션
-- Version: 1.0
-- Date: 2025-12-29
-- ========================================

-- 1. 물품 태그 마스터 테이블
CREATE TABLE IF NOT EXISTS loot_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL COMMENT '태그명 (예: 인형, 피규어)',
  iconName VARCHAR(100) COMMENT '아이콘 이미지 경로',
  sortOrder INT DEFAULT 0 COMMENT '정렬 순서',
  isActive TINYINT DEFAULT 1 COMMENT '활성화 여부',
  createdAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='득템 물품 태그';

-- 2. 한줄평 프리셋 테이블
CREATE TABLE IF NOT EXISTS loot_comment_presets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  content VARCHAR(100) NOT NULL COMMENT '프리셋 내용',
  sortOrder INT DEFAULT 0 COMMENT '정렬 순서',
  isActive TINYINT DEFAULT 1 COMMENT '활성화 여부',
  createdAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='득템 한줄평 프리셋';

-- 3. 체크인 이유 프리셋 테이블
CREATE TABLE IF NOT EXISTS checkin_reason_presets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  content VARCHAR(100) NOT NULL COMMENT '프리셋 내용',
  sortOrder INT DEFAULT 0 COMMENT '정렬 순서',
  isActive TINYINT DEFAULT 1 COMMENT '활성화 여부',
  createdAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='체크인 이유 프리셋';

-- 4. 인증-태그 매핑 테이블
CREATE TABLE IF NOT EXISTS certification_tags (
  certificationId INT NOT NULL,
  tagId INT NOT NULL,
  PRIMARY KEY (certificationId, tagId),
  FOREIGN KEY (certificationId) REFERENCES certifications(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES loot_tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='인증-태그 매핑';

-- 5. 인증-이유 매핑 테이블
CREATE TABLE IF NOT EXISTS certification_reasons (
  certificationId INT NOT NULL,
  reasonId INT NOT NULL,
  PRIMARY KEY (certificationId, reasonId),
  FOREIGN KEY (certificationId) REFERENCES certifications(id) ON DELETE CASCADE,
  FOREIGN KEY (reasonId) REFERENCES checkin_reason_presets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='인증-이유 매핑';

-- 6. certifications 테이블 컬럼 추가
ALTER TABLE certifications
  ADD COLUMN IF NOT EXISTS comment VARCHAR(200) COMMENT '한줄평 (득템용)',
  ADD COLUMN IF NOT EXISTS rating ENUM('good', 'normal', 'bad') COMMENT '상태 평가 (체크인용)';

-- ========================================
-- 초기 데이터 (Seed)
-- ========================================

-- 물품 태그 초기 데이터
INSERT INTO loot_tags (name, sortOrder) VALUES
  ('인형', 1),
  ('피규어', 2),
  ('키링', 3),
  ('간식', 4),
  ('문구', 5),
  ('기타', 99)
ON DUPLICATE KEY UPDATE name=name;

-- 한줄평 프리셋 초기 데이터
INSERT INTO loot_comment_presets (content, sortOrder) VALUES
  ('집게 힘이 좋아요', 1),
  ('탑이 잘 쌓여있어요', 2),
  ('기계 상태가 좋아요', 3),
  ('가성비 좋아요', 4),
  ('인형이 귀여워요', 5)
ON DUPLICATE KEY UPDATE content=content;

-- 체크인 이유 프리셋 초기 데이터
INSERT INTO checkin_reason_presets (content, sortOrder) VALUES
  ('기계 세팅이 어려워요', 1),
  ('원하는 게 없어요', 2),
  ('돈이 부족해요', 3),
  ('사람이 너무 많아요', 4),
  ('다음에 다시 올게요', 5)
ON DUPLICATE KEY UPDATE content=content;

-- ========================================
-- 인덱스 추가 (성능 최적화)
-- ========================================
CREATE INDEX idx_loot_tags_active ON loot_tags(isActive, sortOrder);
CREATE INDEX idx_loot_comment_presets_active ON loot_comment_presets(isActive, sortOrder);
CREATE INDEX idx_checkin_reason_presets_active ON checkin_reason_presets(isActive, sortOrder);
