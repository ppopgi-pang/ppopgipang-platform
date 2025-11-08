export namespace UserStoreResult {
    export class InBoundSearchDto {
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