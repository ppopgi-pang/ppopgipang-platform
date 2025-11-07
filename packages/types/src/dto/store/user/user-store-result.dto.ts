export namespace UserStoreResult {
    export class inBoundSearchDto {
        success: boolean;
        data: {}[];
        meta: {};
        constructor(success: boolean, data: object[], meta: object) {
            this.success = success;
            this.data = data;
            this.meta = meta;
        }
    }
}