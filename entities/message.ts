import 'reflect-metadata'
import { BaseEntity, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Connection, EntityManager, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import User from './user';
import Group from './group';
type ObjectFunctions = () => Promise<void>;

type FunctionObject = Record<string, ObjectFunctions>;

@Entity({
    database: "testdb",
    name: "messages"
})
class Message {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column('mediumtext')
    public message!: string;

    @ManyToOne(type => User, u => u.id)
    @JoinColumn({
        name: "owner",
        referencedColumnName: "id"
    })
    public owner!: User;

    @ManyToOne(type => User, u => u.id)
    @JoinColumn({
        name: "receipent",
        referencedColumnName: "id"
    })
    public receipent!: User;

    @Column('bool')
    public read!: boolean;

    @ManyToOne(type => Group, g => g.id)
    @JoinColumn({
        name: "group",
        referencedColumnName: "id"
    })
    public group!: Group;
}

export default Message;