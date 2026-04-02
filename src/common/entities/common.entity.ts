import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    //! @CreateDateColumn({ type: 'timestamp' })
    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date

    //! @UpdateDateColumn({ type: 'timestamp', default: null })
    @Column({ type: 'datetime', nullable: true, default: null })
    updatedAt: Date
}