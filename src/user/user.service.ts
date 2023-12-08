import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { Repository } from 'typeorm';
import {Response,Request} from "express"
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private user : Repository<User>,
    private authService : AuthService
  ){}

  async create(createUserDto: CreateUserDto,res : Response) {
    try{
      const {name} = createUserDto;
      const data = await this.user.findOne({where : {name}})
      if(data){
        throw ({
          message : "이름중복입니다",
          status : 400
        })
      }
      await this.user.save(createUserDto)
      return res.status(200).json({
        message : "회원가입성공",
        success : true
      })
    }catch(error){
      res.status(error.status).json({
        success : false,
        message : error.message
      })
    }
  }


  async remove(userId: string,res : Response, req : Request) {
    const verify = await this.authService.verify(req)
    try{
      if(userId != verify.userId){
        throw ({
          status : 403,
          message : "삭제권한없음"
        })
      }
      const data = await this.user.findOne({where : {userId}})
      await this.user.remove(data)
      return res.status(200).json({
        success : true,
        message : "삭제완료"
      })
    }catch(error){
      res.status(error.status).json({
        message : error.message
      })
    }
  }
}
