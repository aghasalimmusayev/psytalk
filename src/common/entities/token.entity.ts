import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { CommonEntity } from "./common.entity"
import { User } from "./user.entity"
import { TokenType } from "../types"

@Entity()
export class TokenEntity extends CommonEntity {
    @Column()
    tokenHash: string

    @Column({ type: 'enum', enum: TokenType })
    type: TokenType;

    @Column()
    expiresAt: Date

    @Column({ default: false })
    isRevoked: boolean

    @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User
}