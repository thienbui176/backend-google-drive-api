import {
    BadGatewayException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ResponseMessage } from '@/common/decorators/metadata/response-message.decorator';
import { Response } from 'express';
import { FileActionDto } from './dtos/file-action.dto';
import { FileManagerAction } from './enums/file-manager-action.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { UploadFileDto } from './dtos/upload-file.dto';
import { GoogleDrive } from './google-drive.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('file-manager')
export class GoogleDriveController {
    constructor(private readonly googleDrive: GoogleDrive) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    handleAction(@Body() fileAction: FileActionDto) {
        const { action, createFolder, renameFile, deleteFile, moveFile } = fileAction;
        switch (action) {
            case FileManagerAction.CREATE_FOLDER:
                return this.googleDrive.createFolder(createFolder);
            case FileManagerAction.RENAME:
                return this.googleDrive.renameFile(renameFile);
            case FileManagerAction.DELETE:
                return this.googleDrive.deleteFile(deleteFile);
            case FileManagerAction.MOVE:
                return this.googleDrive.moveFile(moveFile);
        }
        throw new BadGatewayException('Invalid action');
    }

    @Post('upload')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Upload file success')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file: Express.Multer.File, @Body() uploadFileData: UploadFileDto) {
        return this.googleDrive.uploadFile(file, uploadFileData);
    }

    @CacheTTL(60 * 1000)
    @Get('folder/:folderId/files')
    @ResponseMessage('Get files success')
    @HttpCode(HttpStatus.OK)
    getFilesFromFolder(@Param('folderId') folderId: string) {
        if (folderId === 'root') return this.googleDrive.getRoot();
        return this.googleDrive.getFiles(folderId);
    }

    @CacheTTL(60 * 1000)
    @Get('files/:fileId')
    @ResponseMessage('Get file success')
    @HttpCode(HttpStatus.OK)
    getFile(@Param('fileId') fileId: string) {
        return this.googleDrive.getFile(fileId);
    }

    @Get('download/:fileId')
    @HttpCode(HttpStatus.OK)
    download(@Param('fileId') fileId: string, @Res() res: Response) {
        const linkRedirect = `https://drive.google.com/uc?export=download&id=${fileId}`;
        res.redirect(linkRedirect);
    }

    @CacheTTL(60 * 1000)
    @Get('about')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get about success')
    getAbout() {
        return this.googleDrive.getAbout();
    }
}
