import { DataSource } from 'typeorm';
import { LootTag } from '../entities/loot-tag.entity';
import { LootCommentPreset } from '../entities/loot-comment-preset.entity';
import { CheckinReasonPreset } from '../entities/checkin-reason-preset.entity';

export async function seedCertificationPresets(dataSource: DataSource) {
    const lootTagRepository = dataSource.getRepository(LootTag);
    const lootCommentRepository = dataSource.getRepository(LootCommentPreset);
    const checkinReasonRepository = dataSource.getRepository(CheckinReasonPreset);

    // Check if data already exists
    const existingTags = await lootTagRepository.count();
    if (existingTags > 0) {
        console.log('Certification presets already seeded, skipping...');
        return;
    }

    console.log('Seeding certification presets...');

    // Seed Loot Tags
    const tags = [
        { name: '인형', sortOrder: 1 },
        { name: '피규어', sortOrder: 2 },
        { name: '키링', sortOrder: 3 },
        { name: '간식', sortOrder: 4 },
        { name: '문구', sortOrder: 5 },
        { name: '기타', sortOrder: 99 }
    ];
    await lootTagRepository.save(tags);
    console.log(`✅ Seeded ${tags.length} loot tags`);

    // Seed Loot Comment Presets
    const comments = [
        { content: '집게 힘이 좋아요', sortOrder: 1 },
        { content: '탑이 잘 쌓여있어요', sortOrder: 2 },
        { content: '기계 상태가 좋아요', sortOrder: 3 },
        { content: '가성비 좋아요', sortOrder: 4 },
        { content: '인형이 귀여워요', sortOrder: 5 }
    ];
    await lootCommentRepository.save(comments);
    console.log(`✅ Seeded ${comments.length} loot comment presets`);

    // Seed Check-in Reason Presets
    const reasons = [
        { content: '기계 세팅이 어려워요', sortOrder: 1 },
        { content: '원하는 게 없어요', sortOrder: 2 },
        { content: '돈이 부족해요', sortOrder: 3 },
        { content: '사람이 너무 많아요', sortOrder: 4 },
        { content: '다음에 다시 올게요', sortOrder: 5 }
    ];
    await checkinReasonRepository.save(reasons);
    console.log(`✅ Seeded ${reasons.length} check-in reason presets`);

    console.log('✅ Certification presets seeded successfully!');
}
