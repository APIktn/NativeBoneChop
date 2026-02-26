import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { JwtGuard } from './guards/jwt.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto)

    return {
      message: 'login successful',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    }
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const result = await this.authService.refreshAccessToken(
      body.refreshToken,
    )

    return {
      message: 'token refreshed',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    }
  }
  
  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    await this.authService.logout(body.refreshToken)

    return { message: 'logout successful' }
  }

  @UseGuards(JwtGuard)
  @Post('logout-all')
  async logoutAll(@Req() req: any) {
    const userId = req.user.id

    await this.authService.logoutAll(userId)

    return { message: 'logged out from all devices' }
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@Req() req: any) {
    return this.authService.me(req.user.id)
  }
}