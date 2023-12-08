import { IsString, Length } from "class-validator";

export class CreateAuthDto {
  @IsString()
  @Length(1,15)
  name : string;

  @IsString()
  @Length(8,20)
  password : string
}
