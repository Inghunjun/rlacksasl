import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {Response,Request} from "express"

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  async create(@Body() createAuthDto: CreateAuthDto,@Res() res : Response) {
    return await this.authService.login(createAuthDto,res)
    //return this.authService.create(createAuthDto);
  }

}
