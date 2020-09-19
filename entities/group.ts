import 'reflect-metadata'
import { BaseEntity, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Connection, EntityManager, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import User from './user';
import Message from './message';
type ObjectFunctions = () => Promise<void>;

type FunctionObject = Record<string, ObjectFunctions>;

@Entity({
    database: "testdb",
    name: "group"
})
class Group {
    @PrimaryColumn('int')
    public id!: number;

    @Column('varchar')
    public groupName!: string;

    @ManyToMany(type => User, u => u.id)
    @JoinTable({
        name: "groups",
        joinColumn: {
            name: "group",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "user",
            referencedColumnName: "id"
        }
    })
    public member!: User[];

    @OneToMany(type => Message, m => m.group)
    public messages!: Message[];

    @ManyToMany(type => Message, m => m.id)
    @JoinTable({
        name: "groupmessages",
        joinColumn: {
            name: "owner",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "message",
            referencedColumnName: "id"
        }
    })
    public groupMessages!: Message[];
}

export default Group;