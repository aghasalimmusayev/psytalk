import { Column, Entity, ManyToOne } from "typeorm";
import { DocumentStatus, DocumentType } from "../types";
import { CommonEntity } from "./common.entity";
import { User } from "./user.entity";

@Entity('documents')
export class DocumentEntity extends CommonEntity {
    @Column()
    url: string;

    @Column({ type: 'varchar', default: DocumentType.DIPLOMA })
    type: DocumentType;

    @Column({ nullable: true })
    title: string;

    @Column({ type: 'varchar', default: DocumentStatus.PENDING })
    status: DocumentStatus;

    @ManyToOne(() => User, (user) => user.documents, { onDelete: 'CASCADE' })
    user: User;
}
