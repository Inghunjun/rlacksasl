import { Exclude } from "class-transformer";
import { IsString, Length } from "class-validator";

export class CreateUserDto {
  @Exclude()
  userId : string

  @IsString()
  @Length(1,15)
  name : string;

  @IsString()
  @Length(8,20)
  password : string
}
