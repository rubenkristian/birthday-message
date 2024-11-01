import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: false })
    first_name: string;
  
    @Column({ nullable: false })
    last_name: string;
  
    @Column({ unique: true, nullable: false })
    email: string;
  
    @Column({ nullable: false })
    location: string;
  
    @Column({ nullable: true })
    last_status: string;
  
    @Column({ type: 'date', nullable: false })
    birthday: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    last_updated: Date;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    updated_at: Date;
}
