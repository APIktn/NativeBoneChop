import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateProfileDto } from './dto/profile.dto'
import { UploadService } from '../upload/upload.service'

@Injectable()
export class ProfileService {

  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async getProfile(userCode: string) {

    const user = await this.prisma.user.findUnique({
      where: { UserCode: userCode },
      select: {
        UserCode: true,
        UserEmail: true,
        UserName: true,
        FirstName: true,
        LastName: true,
        Address: true,
        Tel: true,
        Profile_Image: true,
        Upload_Image: true,
      }
    })

    if (!user) throw new NotFoundException('user not found')

    return {
      userCode: user.UserCode,
      email: user.UserEmail,
      userName: user.UserName,
      firstName: user.FirstName,
      lastName: user.LastName,
      address: user.Address,
      tel: user.Tel,
      imageProfile: user.Profile_Image,
      imageUpload: user.Upload_Image,
      displayName: user.UserName
        ? user.UserName
        : `${user.FirstName} ${user.LastName}`,
    }
  }

  async updateProfile(
    userCode: string,
    dto: UpdateProfileDto,
    imageUrl?: string,
    imagePublicId?: string,
  ) {

    const user = await this.prisma.user.findUnique({
      where: { UserCode: userCode },
      select: {
        Upload_Image_Id: true,
      },
    })

    if (!user) {
      throw new NotFoundException('user not found')
    }

    if (imagePublicId && user.Upload_Image_Id) {
      await this.uploadService.deleteImage(user.Upload_Image_Id)
    }

    await this.prisma.user.update({
      where: { UserCode: userCode },
      data: {
        FirstName: dto.firstName ?? undefined,
        LastName: dto.lastName ?? undefined,
        UserName: dto.userName ?? undefined,
        Address: dto.address ?? undefined,
        Tel: dto.tel ?? undefined,
        Upload_Image: imageUrl ?? undefined,
        Upload_Image_Id: imagePublicId ?? undefined,
        UpdateBy: userCode,
        UpdateDateTime: new Date(),
      }
    })

    return this.getProfile(userCode)
  }

}