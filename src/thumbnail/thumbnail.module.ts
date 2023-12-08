import { Module } from '@nestjs/common';
import { ThumbnailService } from './thumbnail.service';
import { ThumbnailController } from './thumbnail.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/domain/video.entity';
@Module({
  imports : [AuthModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const e = path.join(`${__dirname}`,"..","..","..",`/thumbnail`)

          cb(null,e/* "C:/studynest/JBWvideo/uploads"*/ /*path.join(`${__dirname}`,"..",`/uploads`)*/); // uploads 디렉토리로 저장
        },
        filename: (req, file, cb) => {
          const uniqueFileName = `${uuidv4()}-${file.originalname}`;
          cb(null,uniqueFileName) // 파일명은 업로드된 원래 파일명 사용
        },
      }),
      fileFilter(req, file, cb) {
        console.log(file.mimetype)
        if(file.mimetype =="image/png"){
          cb(null,true)
  
        }
        cb(null,false)
      },
    }),
    TypeOrmModule.forFeature([Video])
  ],
  controllers: [ThumbnailController],
  providers: [ThumbnailService],
})
export class ThumbnailModule {}
