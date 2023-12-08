import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';

@Module({
  imports : [JwtModule.register({
    secret : "secret",
    signOptions : {expiresIn : "300000s"}
  }),TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService],
  exports : [JwtModule,AuthService]
})
export class AuthModule {}
