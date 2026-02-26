import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class UploadService {

  constructor(private config: ConfigService) {

    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUD_API_KEY'),
      api_secret: this.config.get<string>('CLOUD_API_SECRET'),
    })
  }

  async uploadImage(file: Express.Multer.File, folder: string) {

    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      { folder }
    )

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  }

  async deleteImage(publicId: string) {
    await cloudinary.uploader.destroy(publicId)
  }
}