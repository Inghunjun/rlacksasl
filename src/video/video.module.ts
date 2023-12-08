import { BadRequestException, Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/domain/video.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/domain/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports : [TypeOrmModule.forFeature([Video,User]),AuthModule,
  MulterModule.register({
    storage: diskStorage({
      destination: (req, file, cb) => {
        const e = path.join(`${__dirname}`,"..","..","..",`/uploads`)
      //  console.log( path.join(`${__dirname}`,"..","..",`/uploads`))
        //console.log("Upload directory:", path.join(__dirname, '..', '/uploads'));

        cb(null,e/* "C:/studynest/JBWvideo/uploads"*/ /*path.join(`${__dirname}`,"..",`/uploads`)*/); // uploads 디렉토리로 저장
      },
      filename: (req, file, cb) => {
        const uniqueFileName = `${uuidv4()}-${file.originalname}`;
        cb(null,uniqueFileName) // 파일명은 업로드된 원래 파일명 사용
      },
    }),
    fileFilter(req, file, cb) {
      if(file.mimetype =="video/mp4"){
        cb(null,true)

      }
      cb(null,false)
    },
  })


],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}