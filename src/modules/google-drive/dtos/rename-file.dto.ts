import { IsNotEmpty, IsString } from 'class-validator';

export class RenameFileDto {
    @IsString()
    @IsNotEmpty()
    fileId: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
