import { Exclude } from "class-transformer";
import { IsString, Length } from "class-validator";

export class CreateVideoDto {
  @Exclude()
  videoId : string;

  @Exclude()
  video : string;

  @IsString()
  @Length(1,30)
  title : string;

  @IsString()
  explain : string

  @Exclude()
  time : Date;

  @Exclude()
  name : string

  @Exclude()
  userId : string

  @Exclude()
  thumbnail : string
}
