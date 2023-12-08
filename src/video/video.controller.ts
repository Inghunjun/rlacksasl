import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, Req, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {Response,Request} from "express"
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';


@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post("/uploads")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File,@Body() createVideoDto : CreateVideoDto,@Res() res : Response,@Req() req : Request) {
    return await this.videoService.upload(createVideoDto,file,res,req)
  }//file :파일 mp4아니면 빠꾸먹음,title : 제목, explain : 설명인데 없으면 그냥 문자열로 공백 보내라

  @Get("/findAll")
  async findAll(@Req() req : Request,@Res() res : Response) {
     return await this.videoService.findAlla(req,res);
  }//ㄴ

  @Get("/findUserVideo/:id")
  async findUserVideo(@Param('id') id: string,@Res() res : Response,@Req() req : Request){
    return await this.videoService.findUserVideo(id,req,res)
  }//id는 대부분 videoId


  @Get(':id')
  async stream(@Param('id') id: string,@Res() res : Response,@Req() req : Request) {
    const e = await this.videoService.fileExists(id,res)
    if(!e){
      return e
    }
    return this.videoService.streamVideo(e,res,req);
  }//비디오Id

  @Patch("/private/:id")
  async openAndClose(@Param('id') id: string,@Res() res : Response,@Req() req : Request){
    return await this.videoService.openAndClose(id,req,res);
  }//비디오Id


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string,@Req() req : Request, @Res() res : Response) {
    return await this.videoService.remove(id,req,res);
  }//이또한 비디오 id
}