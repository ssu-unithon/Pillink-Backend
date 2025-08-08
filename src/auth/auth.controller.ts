import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import {
  CreateUserDTO,
  LoginUserDTO,
  OAuthDTO,
  UpdateUserDTO,
} from './dto/user.dto';
import { LoginGuard } from './security/auth.guard';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Payload } from './security/payload.interface';

interface TokenResponse {
  accessToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  private readonly logger = new Logger('Auth');

  @Get('test')
  @UseGuards(LoginGuard)
  test(@Req() req: Request) {
    return req.user;
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDTO): Promise<TokenResponse> {
    if (!loginDto.email || !loginDto.password)
      throw new BadRequestException(
        '이메일 또는 비밀번호를 입력하여야 합니다.',
      );
    this.logger.log(`${loginDto.email} 로그인`);
    return await this.authService.vaildateUser(loginDto);
  }

  @Post('register')
  async register(@Body() createDto: CreateUserDTO) {
    this.logger.log(`${createDto.email} 회원가입`);
    return await this.authService.register(createDto);
  }

  @Delete('me')
  @UseGuards(LoginGuard)
  async deleteMe(@Req() req: Request) {
    // 인증 추가
    const payload = req.user as Payload;
    this.logger.log(`${payload?.email} 회원탈퇴`);
    return await this.authService.deleteByPayload(payload);
  }

  @Patch()
  @UseGuards(LoginGuard)
  async update(@Req() req: Request, @Body() updateDto: UpdateUserDTO) {
    return this.userService.update((req.user as Payload).id, updateDto);
  }

  //SECTION - OAuth 2.0
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    this.logger.log(`누군가 Google Redirect 요청`);
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const user = req.user as OAuthDTO;
    const existUser = await this.userService.findOne({ email: user.email });

    if (!existUser) {
      // Register flow
      const redirectUrl = `exp://192.168.45.63//--/auth/google/redirect?status=register&email=${user.email}&name=${user.name}&provider=${user.provider}`;
      return res.redirect(redirectUrl);
    } else {
      // Login flow
      const tokenResponse = this.authService.vaildateOAuth(user, existUser);
      const redirectUrl = `exp://192.168.45.63//--/auth/google/redirect?status=login&accessToken=${tokenResponse.accessToken}`;
      return res.redirect(redirectUrl);
    }
  }
}
