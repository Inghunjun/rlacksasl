import { Injectable } from '@nestjs/common';
import { CreateThumbnailDto } from './dto/create-thumbnail.dto';
import { UpdateThumbnailDto } from './dto/update-thumbnail.dto';
import {Response,Request} from "express"
import * as fs from 'fs';
import path, { join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/domain/video.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class ThumbnailService {

  constructor(
    @InjectRepository(Video)
    private video : Repository<Video>,
    private authService : AuthService
  ){}

  async base64Incoding(file : Express.Multer.File,req : Request, res : Response,videoId : string){//셈네일 수정밑생서ㅓㅅㅇ
    const verify = await this.authService.verify(req);
    const cwd = process.cwd()
    const path2 = join(cwd,"..","thumbnail")
    const path = join(/*'C:/studynest/JBWvideo/uploads'*/path2, `${file.filename}`);
    try{
      const data = await this.video.findOne({where : {videoId}})
      if(!data){
        throw ({message : "그런거없음", status : 404})
      }
      if(data.name != verify.name){
        throw ({message : "권한없음", status : 400})
      }
      const imageBuffer = fs.readFileSync(path);
      const base64Image = imageBuffer.toString('base64');
      data.thumbnail = base64Image
      await this.video.save(data)
      fs.unlink(path,(error)=>{
        if(error){
          throw ({message : "ㅈ댔다", status : 500})
        }else{
          return res.status(200).json({
            message : "성공적으로 완료"
          })
        }
      })
    }catch(error){
      if(error.status == 404||error.status == 400){
        return res.status(error.status).json({message : error.message})
      }
      return res.status(500).json({message : "ise"})
    }


  }

  create(createThumbnailDto: CreateThumbnailDto) {
    return 'This action adds a 0 thumbnail';
  }

  findAll() {
    return `This action returns all thumbnail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} thumbnail`;
  }

  update(id: number, updateThumbnailDto: UpdateThumbnailDto) {
    return `This action updates a #${id} thumbnail`;
  }

  remove(id: number) {
    return `This action removes a #${id} thumbnail`;
  }
}
