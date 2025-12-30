import { ApiProperty } from "@nestjs/swagger";

export namespace ProposalResult {
    export class StoreInfoDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'Sample Name' })
        name: string;

        constructor(id: number, name: string) {
            this.id = id;
            this.name = name;
        }
    }

    export class ProposalDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'Sample Name' })
        name: string;
        @ApiProperty({ type: String, example: 'Seoul, Korea' })
        address: string;
        @ApiProperty({ type: Number, example: 37.5665 })
        latitude: number;
        @ApiProperty({ type: Number, example: 126.978 })
        longitude: number;
        @ApiProperty({ type: String, enum: ['pending', 'approved', 'rejected'], example: 'pending' })
        status: 'pending' | 'approved' | 'rejected';
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        createdAt: Date;
        @ApiProperty({ type: () => StoreInfoDto, example: { id: 1, name: 'Sample Name' }, required: false, nullable: true })
        store?: StoreInfoDto | null;

        constructor(
            id: number,
            name: string,
            address: string,
            latitude: number,
            longitude: number,
            status: 'pending' | 'approved' | 'rejected',
            createdAt: Date,
            store?: StoreInfoDto | null
        ) {
            this.id = id;
            this.name = name;
            this.address = address;
            this.latitude = latitude;
            this.longitude = longitude;
            this.status = status;
            this.createdAt = createdAt;
            this.store = store;
        }
    }

    export class MyProposalsDto {
        @ApiProperty({ type: () => [ProposalDto], example: [{ id: 1, name: 'Sample Name', address: 'Seoul, Korea', latitude: 37.5665, longitude: 126.978, status: 'pending', createdAt: '2024-01-01T00:00:00.000Z', store: { id: 1, name: 'Sample Name' } }] })
        items: ProposalDto[];
        @ApiProperty({ type: Number, example: 20 })
        total: number;
        @ApiProperty({ type: Number, example: 1 })
        page: number;
        @ApiProperty({ type: Number, example: 10 })
        size: number;

        constructor(items: ProposalDto[], total: number, page: number, size: number) {
            this.items = items;
            this.total = total;
            this.page = page;
            this.size = size;
        }
    }

    export class CreateProposalResultDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, enum: ['pending'], example: 'pending' })
        status: 'pending';
        @ApiProperty({ type: Number, example: 50 })
        expGained: number;

        constructor(id: number, status: 'pending', expGained: number) {
            this.id = id;
            this.status = status;
            this.expGained = expGained;
        }
    }
}
