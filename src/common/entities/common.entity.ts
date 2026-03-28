import { BaseEntity, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    //! @CreateDateColumn({ type: 'timestamp' })
    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date

    //! @UpdateDateColumn({ type: 'timestamp', default: null })
    @UpdateDateColumn({ type: 'datetime', default: null })
    updatedAt: Date
}