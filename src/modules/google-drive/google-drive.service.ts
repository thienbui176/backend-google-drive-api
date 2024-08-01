import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { drive_v3, google } from 'googleapis';
import { GaxiosError } from 'googleapis-common';
import { FileType } from './enums/file-type.enum';
import { CreateFolderDto } from './dtos/create-folder.dto';
import { RenameFileDto } from './dtos/rename-file.dto';
import { DeleteFileDto } from './dtos/delete-file.dto';
import { MoveFileDto } from './dtos/move-file.dto';
import { RedisService } from '../redis/redis.service';
import { UploadFileDto } from './dtos/upload-file.dto';
import { Readable } from 'stream';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const googleCloudCredential = require('/Users/buithien.dev/Desktop/Freelance/Backend_R8ckie/credentials/google-cloud.json');
const FIELD_FILE =
    'files/size,files/properties,files/mimeType,files/name,files/id,files/iconLink,files/trashed,files/modifiedTime';

export const authorize = async () => {
    const { client_email, private_key } = googleCloudCredential;
    const jwtClient = new google.auth.JWT(client_email, null, private_key, [
        'https://www.googleapis.com/auth/drive ',
    ]);
    await jwtClient.authorize();
    return jwtClient;
};

@Injectable()
export class GoogleDrive {
    constructor(private readonly redisService: RedisService) {}

    async uploadFile(file: Express.Multer.File, payload: UploadFileDto) {
        const { folderId } = payload;
        const drive = await this.driveInstance();

        const response = await drive.files
            .create({
                requestBody: {
                    name: this.formatNameFile(file.originalname),
                    mimeType: file.mimetype,
                    parents: [folderId],
                },
                media: {
                    body: Readable.from(file.buffer),
                    mimeType: file.mimetype,
                },
            })
            .catch((error: GaxiosError) => {
                throw new HttpException(error.message, 400);
            });
        const responseData = this.addAndConvertFields(response.data);
        await drive.permissions.create({
            fileId: responseData.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
        if (
            FileType[responseData.mimeType] === 'PNG' ||
            FileType[responseData.mimeType] === 'JPEG'
        ) {
            this.redisService.set(responseData.name, responseData.id, 600000000000);
        }
        return responseData;
    }

    async createFolder(payload: CreateFolderDto) {
        const { name, folderId } = payload;
        const drive = await this.driveInstance();
        const folder = {
            name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [folderId],
        };

        const response = await drive.files
            .create({ requestBody: folder })
            .catch((error: GaxiosError) => {
                throw new HttpException(error.message, error.response.status);
            });
        return this.addAndConvertFields(response.data);
    }

    async deleteFile(payload: DeleteFileDto) {
        const drive = await this.driveInstance();
        const { fileId } = payload;
        await drive.files.delete({ fileId }).catch((error: GaxiosError) => {
            throw new HttpException(error.message, error.response.status);
        });
        return null;
    }

    async renameFile(payload: RenameFileDto) {
        const drive = await this.driveInstance();
        const { fileId, name } = payload;
        const response = await drive.files
            .update({
                fileId,
                requestBody: {
                    name,
                },
            })
            .catch((error: GaxiosError) => {
                throw new HttpException(error.message, error.response.status);
            });

        return this.addAndConvertFields(response.data);
    }

    async moveFile(payload: MoveFileDto) {
        const { fileId, destinationFolderId } = payload;
        const drive = await this.driveInstance();

        const response = await drive.files
            .update({
                fileId,
                addParents: destinationFolderId,
            })
            .catch((error: GaxiosError) => {
                throw new HttpException(error.message, error.response.status);
            });
        return this.addAndConvertFields(response.data);
    }

    async getFiles(folderId: string) {
        const drive = await this.driveInstance();
        try {
            const response = await drive.files.list({
                fields: FIELD_FILE,
                q: `'${folderId}' in parents and trashed = false`,
            });
            const responseData = this.mapType(response.data.files);
            return responseData;
        } catch (error) {
            if (error instanceof GaxiosError) {
                throw new HttpException(error.message, error.response.status);
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getRoot() {
        const drive = await this.driveInstance();
        try {
            const response = await drive.files.list({
                fields: FIELD_FILE,
                q: `('root' in parents or sharedWithMe = true) and trashed = false`,
            });

            const responseData = this.mapType(response.data.files);
            return responseData;
        } catch (error) {
            if (error instanceof GaxiosError) {
                throw new HttpException(error.message, error.response.status);
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getFile(fileId: string) {
        const drive = await this.driveInstance();
        try {
            const response = await drive.files.get({
                fileId,
                fields: 'name,size,id,mimeType,iconLink,modifiedTime',
            });
            return this.addAndConvertFields(response.data);
        } catch (error) {
            if (error instanceof GaxiosError) {
                throw new HttpException(error.message, error.response.status);
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAbout() {
        const drive = await this.driveInstance();
        const response = await drive.about.get({ fields: 'storageQuota' }).catch((error) => {
            if (error instanceof GaxiosError) {
                throw new HttpException(error.message, error.response.status);
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        });
        return response.data.storageQuota;
    }

    private mapType(listFile: drive_v3.Schema$File[]) {
        return listFile.map((file) => this.addAndConvertFields(file));
    }

    private addAndConvertFields(file: drive_v3.Schema$File) {
        return {
            ...file,
            type: FileType[file.mimeType],
        };
    }

    private formatNameFile(fileName: string): string {
        const timeNumber = this.genarateTimeNumber();
        const fileNameAfterRemoveSpace = fileName.replaceAll(' ', '-');
        return timeNumber + '-' + fileNameAfterRemoveSpace;
    }

    private genarateTimeNumber(): number {
        return Date.now();
    }

    private async driveInstance() {
        const authClient = await authorize();
        const drive = google.drive({ version: 'v3', auth: authClient });
        return drive;
    }
}
