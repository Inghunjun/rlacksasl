import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import {Response,Request} from "express"
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/domain/video.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { createReadStream } from 'fs';
import * as fs from 'fs';
import path, { join } from 'path';
import { error } from 'console';
import { User } from 'src/domain/user.entity';

//섬네일 내꺼보기   
@Injectable()
export class VideoService {

  constructor(
    @InjectRepository(Video)
    private video : Repository<Video>,
    private authService : AuthService,
    @InjectRepository(User)
    private user : Repository<User>,
  ){}

  async findUserVideo(userId : string, req : Request, res : Response){//특정인이 올린영상보는거 본인일떄 비공영상까지보여줌
    const verify = await this.authService.verify(req)
    try{
      const userdata = await this.user.findOne({where : {userId}})
      if(!userdata){
        throw ({message : "그런 유저 없습니다",status : 404})
      }
      if(userdata.userId == verify.userId){//본인일때 
        const mydata = await this.video.find({where : {userId}})
        return res.status(200).json({message : "찾기성공", data : mydata})
      }else{//본인이 아닐때
        const data = await this.video.find({where : {userId,open : true}})
        return res.status(200).json({message : "찾기성공", data : data})
      }
    }catch(error){
      if(error.status==404){
        return res.status(error.status).json({message : error.message})
      }
      return res.status(500).json({message : "ise"})
    }
  }
  

   async upload(createAuthDto : CreateVideoDto,file :Express.Multer.File,res : Response, req : Request) {//영상업로드
    const verify = await this.authService.verify(req)

    try{
      createAuthDto.name = verify.name
      createAuthDto.userId =verify.userId
      createAuthDto.time = new Date();
      createAuthDto.video = file.filename,
      await this.video.save(createAuthDto)
      return res.status(200).json({
        success : true,
        message : "업로드성공"
      })
    }catch(error){
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' });
    }

  }

  streamVideo(videoId : string,res : Response, req : Request){//영상재생
    const cwd = process.cwd()
    const path2 = join(cwd,"..","uploads")
    console.log(path2)
    const path = join(/*'C:/studynest/JBWvideo/uploads'*/path2, `${videoId}`);

    // 동영상 파일의 통계(크기 등)를 가져옵니다.
    const stat = fs.statSync(path);
    
    // 파일의 전체 크기를 확인합니다.
    const fileSize = stat.size;

    // HTTP 요청 헤더에서 Range를 확인합니다.
    const range = req.headers.range;

    // Range 헤더가 있는지 여부에 따라 파일의 일부분을 전송할지 결정합니다.
    if (range) {
      // Range 헤더에서 시작과 끝 부분을 추출합니다.
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;

      // 부분적으로 읽어온 파일을 응답 스트림으로 전송합니다.
      const file = createReadStream(path, { start, end });
      
      // 부분적으로 전송하기 위한 HTTP 응답 헤더를 설정합니다.
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      
      // 206 Partial Content 상태 코드로 응답합니다.
      res.writeHead(206, head);
      
      // 파일 스트림을 클라이언트 응답 스트림으로 연결하여 전송합니다.
      file.pipe(res);
    } else {
      // Range 헤더가 없는 경우 전체 파일을 응답 스트림으로 전송합니다.
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      
      // 200 OK 상태 코드로 응답합니다.
      res.writeHead(200, head);
      
      // 전체 파일을 클라이언트 응답 스트림으로 연결하여 전송합니다.'
        createReadStream(path).pipe(res);
    }
  }

   async fileExists(videoId: string,res: Response){//파일이쓴ㄴ지찾는건데 서버에서만쓰는거
    try {
      const data = await this.video.findOne({where : {videoId,open : true}})
      if(!data){
        throw ({
          status : 404,
          message : "찾을수없는영상"
        })
      }
      // 파일의 상태를 가져옵니다.
      const path2 = join(process.cwd(),"..","uploads")
      const path = join(/*'C:/studynest/JBWvideo/uploads'*/path2, `${data.video}`);
      fs.statSync(path);
      return data.video; // 파일이 존재하면 true를 반환합니다.
    } catch (error) {
      if (error.status === 404) {
            res.status(error.status).json({
          message : "찾을수없는영상"
        })
      }else{
        throw error; // 다른 예외는 다시 던집니다.
      }
    }
  }

  async findAlla(req : Request,res : Response) {//전체찾기 비공개 제외
    try{
      const data = await this.video.find({where : {open : true}});
        return res.status(200).json({
        data : data,
      })
      
    }catch(error){
      console.log(error)
      return res.status(500).json({
        error: "Internal Server Error",
      })
    }
    


  }

  async findOne(videoId: string,res : Response) {//서베어서만 사용하는거
    try{
      const data = await this.video.findOne({where : {videoId}})
      if(data){
        return data
      }
      throw ({
        message : "찾을 데이터 없습니다",
        status : 404
      })
    }catch(error){
      if(error.status==404){
        return res.status(error.status).json({
          message : error.message
        })
      }
      throw error
    }
  }

  async openAndClose(videoId : string,req : Request,res : Response){//영상 비공개 또는 공개 
    const verify = await this.authService.verify(req)
    try{
      const data = await this.video.findOne({where : {videoId}})
      if(!data){
        throw ({message : "그런 영상읍 없어요",status : 404})
      }
      if(data.name != verify.name){
        throw ({message : "권한이 업성요",status : 401})
      }
      const test = data.open==false ? true : false
      data.open = test
      await this.video.save(data)
      return res.status(200).json({
        message : "전환 완료"
      })
    }catch(error){
      if(error.status==404||error.status==401){
        return res.status(error.status).json({message : error.message})
      }
      return res.status(500).json({message : "ise"})
    }
  }

  async remove(videoId : string,req : Request, res : Response) {//영상삭제
    const verify = await this.authService.verify(req);
    const name = verify.name
    try{
      const data = await this.video.findOne({where : {videoId}})
      const cwd = process.cwd()
      const path2 = join(cwd,"..","/uploads")
      const path = join(/*'C:/studynest/JBWvideo/uploads'*/path2, `${data.video}`);
      if(!data){
        throw ({status : 404,message : "그런거없ㅇ습니다"})
      }
      if(data.name !=  name){
        throw ({status : 400, message : "권한이없어요"})
      }
      await this.video.remove(data)
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
      if(error.status ==404||error.status == 400){
        return res.status(error.status).json({message : error.message})
      }
      return res.status(500).json({message : "ise"})
    }
  }
}
