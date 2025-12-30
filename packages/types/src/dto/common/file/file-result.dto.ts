import { ApiProperty } from "@nestjs/swagger";

export namespace FileResult {
    export class UploadDto {
        @ApiProperty({ type: String, example: 'file.jpg' })
        fileName: string;
        
        constructor(fileName: string) {
            this.fileName = fileName;
        }
    }
}
