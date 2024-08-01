import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFolderDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    folderId: string;
}
