import { Module } from '@nestjs/common';

import { VideoModule } from './video/video.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './orm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ThumbnailModule } from './thumbnail/thumbnail.module';

@Module({
  imports: [VideoModule,TypeOrmModule.forRootAsync({useFactory : ormConfig}), AuthModule, UserModule, ThumbnailModule],

})
export class AppModule {}
