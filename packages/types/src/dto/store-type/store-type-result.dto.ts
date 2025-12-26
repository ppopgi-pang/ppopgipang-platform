export namespace StoreTypeResult {

    export class StoreTypeDto {
        id: number;
        name: string;
        description: string;

        constructor(id: number, name: string, description: string) {
            this.id = id;
            this.name = name;
            this.description = description;
        }
    }

    export class ListTypeDto {
        storeTypes: StoreTypeDto[];

        constructor(storeTypes: StoreTypeDto[]) {
            this.storeTypes = storeTypes;
        }
    }
}