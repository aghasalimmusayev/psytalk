import { BaseEntity, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp', default: null })
    updatedAt: Date
}