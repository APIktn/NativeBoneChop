import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'
import { PrismaModule } from '../prisma/prisma.module'
import { UploadModule } from '../upload/upload.module'

@Module({
  imports: [PrismaModule,UploadModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
