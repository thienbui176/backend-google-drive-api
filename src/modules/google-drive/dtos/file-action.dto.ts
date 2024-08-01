import {
    IsString,
    IsNotEmpty,
    ValidateIf,
    IsOptional,
    IsEnum,
    IsObject,
    ValidateNested,
    IsNotEmptyObject,
} from 'class-validator';
import { FileManagerAction } from '../enums/file-manager-action.enum';
import { RenameFileDto } from './rename-file.dto';
import { CreateFolderDto } from './create-folder.dto';
import { Type } from 'class-transformer';
import { DeleteFileDto } from './delete-file.dto';
import { MoveFileDto } from './move-file.dto';

export class FileActionDto {
    @IsEnum(FileManagerAction)
    @IsNotEmpty()
    action: FileManagerAction;

    @ValidateIf((o) => o.action === FileManagerAction.RENAME)
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => RenameFileDto)
    renameFile: RenameFileDto;

    @ValidateIf((o) => o.action === FileManagerAction.CREATE_FOLDER)
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CreateFolderDto)
    createFolder: CreateFolderDto;

    @ValidateIf((o) => o.action === FileManagerAction.DELETE)
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => DeleteFileDto)
    deleteFile: DeleteFileDto;

    @ValidateIf((o) => o.action === FileManagerAction.MOVE)
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => MoveFileDto)
    moveFile: MoveFileDto;
}
