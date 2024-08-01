import { IsNotEmpty, IsString } from 'class-validator';

export class MoveFileDto {
    @IsString()
    @IsNotEmpty()
    fileId: string;

    @IsString()
    @IsNotEmpty()
    destinationFolderId: string;
}
