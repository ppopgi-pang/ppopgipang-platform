import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export namespace TradeChatInput {
    export class CreateTradeChatRoomDto {
        @ApiProperty({ description: '거래 게시글 ID', example: 1 })
        @IsInt()
        @IsNotEmpty()
        tradeId: number;
    }

    export class CreateTradeChatMessageDto {
        @ApiProperty({ description: '채팅방 ID', example: 1 })
        @IsInt()
        @IsNotEmpty()
        chatRoomId: number;

        @ApiProperty({ description: '메시지 내용', example: '안녕하세요, 물건 구매 원합니다.' })
        @IsNotEmpty()
        message: string;
    }
}

