import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'reklama' })
export class Reklama extends BaseEntity{
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
  message_id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  message_text: string;
}