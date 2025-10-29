import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File, subfolder?: string): Promise<{ url: string; filename: string }> {
    const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3000';
    const uploadPath = subfolder ? `uploads/${subfolder}` : 'uploads';
    
    const filename = file.filename;
    const url = `${baseUrl}/${uploadPath}/${filename}`;

    return {
      url,
      filename,
    };
  }
}
