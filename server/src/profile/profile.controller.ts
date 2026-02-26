import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Req,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtGuard } from '../auth/guards/jwt.guard'
import { ProfileService } from './profile.service'
import { UpdateProfileDto } from './dto/profile.dto'
import { UploadService } from '../upload/upload.service'

@Controller('profile')
@UseGuards(JwtGuard)
export class ProfileController {

  constructor(
    private readonly profileService: ProfileService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  async getProfile(@Req() req: any) {
    return this.profileService.getProfile(req.user.userCode)
  }


  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @Req() req: any,
    @Body() dto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {

    let imageUrl: string | undefined
    let imagePublicId: string | undefined

    if (file) {
      const uploaded = await this.uploadService.uploadImage(
        file,
        'bone_chop/profile'
      )

      imageUrl = uploaded.url
      imagePublicId = uploaded.publicId
    }

    const user = await this.profileService.updateProfile(
      req.user.userCode,
      dto,
      imageUrl,
      imagePublicId,
    )

    return {
      message: 'profile updated',
      user,
    }
  }
}