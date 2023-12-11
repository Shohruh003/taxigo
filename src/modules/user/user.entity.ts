import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'user' })
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  from_id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  chat_id: string;
}