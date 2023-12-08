import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({schema : "jbwvideo", name : "video"})
export class Video {
  @PrimaryGeneratedColumn("uuid")
  videoId : string;

  @Column({name : "video", type : "text"})
  video : string;

  @Column({name : "title", type : "varchar", length : "30"})//30글자 
  title : string;

  @Column({name : "time", type : "datetime"})
  time : Date;

  @Column({name : "name", type : "varchar", length : "15"})
  name : string

  @Column({name : "explain", type : "text",})
  explain : string

  @Column({name : "open", type : "boolean", default : false})
  open : boolean

  @Column({name : "thumbnail", type : "text",nullable : true})
  thumbnail : string

  @ManyToOne(()=>User,(user)=>user.userId,{onDelete : "CASCADE",eager : false})
  userId : User | string
  
}
