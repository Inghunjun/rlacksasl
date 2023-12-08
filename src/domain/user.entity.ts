import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Video } from "./video.entity";

@Entity({schema : "jbwvideo", name : "user"})
export class User {

  @PrimaryGeneratedColumn("uuid")
  userId : string

  @Column({name : "name", type : "varchar", length : "15"})
  name : string;

  @Column({name : "password", type : "varchar", length : "20"})
  password : string

  @OneToMany(()=>Video,(video)=>video.userId,{cascade : true})
  video : Video[] | string

}
