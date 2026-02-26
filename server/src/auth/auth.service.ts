import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'

import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { generateUserCode } from '../utils/user-code.util'
import { generateAvatar } from '../utils/avatar.util'
import { randomUUID } from 'crypto'

interface JwtPayload {
  id: number
  userCode: string
  tokenVersion: number
  jti?: string
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const { firstName, lastName, userEmail, password } = dto

    const hashedPassword = await bcrypt.hash(password, 10)
    const userCode = await generateUserCode(this.prisma)
    const profileImage = generateAvatar(firstName, lastName)

    try {
      await this.prisma.user.create({
        data: {
          UserCode: userCode,
          UserEmail: userEmail.toLowerCase(),
          Password: hashedPassword,
          FirstName: firstName,
          LastName: lastName,
          Profile_Image: profileImage,
          CreateBy: userCode,
          CreateDateTime: new Date(),
          UpdateBy: userCode,
          UpdateDateTime: new Date(),
        },
      })

      return { message: 'register successful' }
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('email already registered')
      }
      throw error
    }
  }

  async login(dto: LoginDto) {
    const { username, password } = dto

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { UserEmail: username.toLowerCase() },
          { UserName: username.toLowerCase() },
        ],
      },
    })

    if (!user) throw new NotFoundException('user not found')

    const ok = await bcrypt.compare(password, user.Password)
    if (!ok) throw new BadRequestException('invalid password')

    const payload: JwtPayload = {
      id: user.Id,
      userCode: user.UserCode,
      tokenVersion: user.TokenVersion,
    }

    const accessToken = this.generateAccessToken(payload)

    const absoluteExpire = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    )

    const { refreshToken } = await this.generateRefreshToken(
      user.Id,
      user.UserCode,
      absoluteExpire,
    )

    return {
      accessToken,
      refreshToken,
      user: {
        userCode: user.UserCode,
        email: user.UserEmail,
        userName: user.UserName,
        firstName: user.FirstName,
        lastName: user.LastName,
      },
    }
  }

  async refreshAccessToken(oldRefreshToken: string) {
    let payload: JwtPayload

    try {
      payload = this.jwtService.verify(oldRefreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      })
    } catch {
      throw new UnauthorizedException('invalid refresh token')
    }

    const tokenInDb = await this.prisma.token.findFirst({
      where: {
        TokenHash: payload.jti,
        UserId: payload.id,
      },
    })

    if (!tokenInDb) {
      throw new UnauthorizedException('refresh token not found')
    }

    const now = new Date()

    if (tokenInDb.AbsoluteExp <= now) {
      await this.prisma.token.delete({ where: { Id: tokenInDb.Id } })
      throw new UnauthorizedException('session expired')
    }

    if (tokenInDb.ExpiresAt <= now) {
      await this.prisma.token.delete({ where: { Id: tokenInDb.Id } })
      throw new UnauthorizedException('refresh expired')
    }

    // rotation
    await this.prisma.token.delete({ where: { Id: tokenInDb.Id } })

    const user = await this.prisma.user.findUnique({
      where: { Id: payload.id },
    })

    if (!user) throw new UnauthorizedException()

    const newAccessToken = this.generateAccessToken({
      id: user.Id,
      userCode: user.UserCode,
      tokenVersion: user.TokenVersion,
    })

    const { refreshToken } = await this.generateRefreshToken(
      user.Id,
      user.UserCode,
      tokenInDb.AbsoluteExp,
    )

    return {
      accessToken: newAccessToken,
      refreshToken,
    }
  }

  async logout(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      })

      await this.prisma.token.deleteMany({
        where: {
          TokenHash: payload.jti,
          UserId: payload.id,
        },
      })
    } catch {
      throw new UnauthorizedException('invalid refresh token')
    }
  }

  async logoutAll(userId: number) {
    await this.prisma.token.deleteMany({
      where: { UserId: userId },
    })

    await this.prisma.user.update({
      where: { Id: userId },
      data: {
        TokenVersion: { increment: 1 },
      },
    })
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { Id: userId },
    })

    if (!user) throw new UnauthorizedException()

    return {
      user: {
        userCode: user.UserCode,
        email: user.UserEmail,
        userName: user.UserName,
        firstName: user.FirstName,
        lastName: user.LastName,
        profileImage: user.Profile_Image,
      },
    }
  }

  private generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    })
  }

  private async generateRefreshToken(
    userId: number,
    userCode: string,
    absoluteExpire: Date,
  ) {
    const jti = randomUUID()

    const refreshExpire = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    )

    const refreshToken = this.jwtService.sign(
      { id: userId, userCode, jti },
      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    )

    await this.prisma.token.create({
      data: {
        UserId: userId,
        TokenHash: jti,
        ExpiresAt: refreshExpire,
        AbsoluteExp: absoluteExpire,
        CreateBy: userCode,
      },
    })

    return { refreshToken }
  }
}