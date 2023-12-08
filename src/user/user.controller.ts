import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {Response,Request} from "express"

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/create")
  async create(@Body() createUserDto: CreateUserDto,@Res() res : Response) {
    return await this.userService.create(createUserDto,res)
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Res() res : Response, @Req() req : Request) {
    return this.userService.remove(id,res,req);
  }
}
