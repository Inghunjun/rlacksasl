import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, Req, UseGuards } from '@nestjs/common';
import { ThumbnailService } from './thumbnail.service';
import { CreateThumbnailDto } from './dto/create-thumbnail.dto';
import { UpdateThumbnailDto } from './dto/update-thumbnail.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {Response,Request} from "express"
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('thumbnail')
export class ThumbnailController {
  constructor(private readonly thumbnailService: ThumbnailService) {}

  @Post("/uploads/:id")//썸네일 생성밑수정 썸네일을 삭제 할 수 는 엄 서 요 
  @UseGuards(JwtAuthGuard   )
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File,@Res() res : Response,@Req() req : Request,@Param("id") id : string) {
    console.log("filename",file.filename)
    await this.thumbnailService.base64Incoding(file,req,res,id)
  }

}
