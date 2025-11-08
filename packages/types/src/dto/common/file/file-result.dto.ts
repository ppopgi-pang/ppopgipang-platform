export namespace FileResult {
    export class UploadDto {
        fileName: string;
        
        constructor(fileName: string) {
            this.fileName = fileName;
        }
    }
}