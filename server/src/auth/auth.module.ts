import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { JwtGuard } from './guards/jwt.guard'

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    JwtGuard,
  ],
  controllers: [AuthController],
  exports: [JwtGuard],
})
export class AuthModule {}
