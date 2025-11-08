export namespace UserStoreResult {
    export class InBoundSearchDto {
        success: boolean;
        data: object[];
        meta: object;
        constructor(success: boolean, data: object[], meta: object) {
            this.success = success;
            this.data = data;
            this.meta = meta;
        }
    }

    export class FindNearByDto {
        success: boolean;
        data: object[];
        meta: object;

        constructor(success: boolean, data: object[], meta: object) {
            this.success = success;
            this.data = data;
            this.meta = meta;
        }
    }
}