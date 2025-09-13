import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

export interface CloudinaryResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: Array<string>;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
}

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    options?: { folder?: string; transformation?: any }
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const { folder, transformation } = options || {};
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as CloudinaryResponse);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}