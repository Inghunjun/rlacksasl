import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {Response,Request} from "express"

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private user : Repository<User>,
    private jwtService : JwtService
  ){}

  async login(createAuthDto : CreateAuthDto,res : Response){
    try{
      const {name,password} = createAuthDto
      const data = await this.user.findOne({where : {name,password}})
      if(!data){
        throw ({
          status : 400,
          success : false,
          message : "실패입니다"
        })
      }
      const signdata = {name : name, userId : data.userId}
      const token = await this.jwtService.signAsync(signdata)
      res.status(200).json({
        token : token,
        success : true
      })
    }catch(error){
      const status = error.status || 500
      res.status(status).json({
        message : error.message,
        success : false
      })
    }
  }

  async verify(req : Request){
    try{
      const token = this.getToken(req)
      if(!token){
        throw new UnauthorizedException("만료된거나 없는토큰")
      }
      const verify = await this.jwtService.verifyAsync(token,{secret : "secret"})
      return verify
    }catch(error){
      throw new UnauthorizedException("만료된거나 없는토큰")
    }

  }

  getToken(req : Request){
    const authorization = req.headers.authorization;
    if(authorization && authorization.startsWith("Bearer ")){//Bearer으로 시작하는 문자열 찾기 
      return authorization.split(" ")[1]//공백을 기준으로 배열로 분할 
    }
    return null
  }


}
