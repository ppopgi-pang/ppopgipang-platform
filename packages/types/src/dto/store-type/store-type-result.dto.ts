import { ApiProperty } from "@nestjs/swagger";

export namespace StoreTypeResult {

    export class StoreTypeDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'Sample Name' })
        name: string;
        @ApiProperty({ type: String, example: 'Sample description' })
        description: string;

        constructor(id: number, name: string, description: string) {
            this.id = id;
            this.name = name;
            this.description = description;
        }
    }

    export class ListTypeDto {
        @ApiProperty({ type: () => [StoreTypeDto], example: [{ id: 1, name: 'Sample Name', description: 'Sample description' }] })
        storeTypes: StoreTypeDto[];

        constructor(storeTypes: StoreTypeDto[]) {
            this.storeTypes = storeTypes;
        }
    }
}
