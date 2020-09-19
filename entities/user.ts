import 'reflect-metadata'
import { BaseEntity, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Connection, EntityManager, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import Image from './image';
import Group from './group';
import Message from './message';
import Customer from './customer';

type ObjectFunctions = () => Promise<void>;

type FunctionObject = Record<string, ObjectFunctions>;

@Entity({
    database: "testdb",
    name: "user"
})
class User {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column('varchar', { length: 255 })
    public firstname!: string;

    @Column('varchar', { length: 255 })
    public lastname!: string;

    @OneToMany( type => Image, i => i.user )
    @JoinColumn({ name: "images", referencedColumnName: "user" })
    public images!: Image[];

    @ManyToMany(type => User, u => u.id)
    @JoinTable({
        name: "friends",
        joinColumn: {
            name: "user",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "friend",
            referencedColumnName: "id"
        }
    })
    public friends!: User[];

    @ManyToMany(type => Group, g => g.id)
    @JoinTable({
        name: "groups",
        joinColumn: {
            name: "user",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "group",
            referencedColumnName: "id"
        }
    })
    public groups!: Group[];

    @OneToMany(type => Message, m => m.owner)
    public outbound!: Message[]

    @OneToMany(type => Message, m => m.receipent)
    public inbound!: Message[]

    @ManyToOne(type => Customer, c => c.id)
    @JoinColumn({
        name: "customer",
        referencedColumnName: "id"
    })
    public customer!: Customer;
}

export default User;