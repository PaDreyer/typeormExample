import 'reflect-metadata'
import { BaseEntity, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Connection, EntityManager, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import Customer from './customer';
import Message from './message';
import Ticketstate from './ticketstate';

type ObjectFunctions = () => Promise<void>;

type FunctionObject = Record<string, ObjectFunctions>;

@Entity({
    database: "testdb",
    name: "tickets"
})
class Ticket {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column('varchar')
    public name!: string;

    @ManyToOne(type => Customer, c => c.id)
    @JoinColumn({
        name: "from",
        referencedColumnName: "id"
    })
    public from!: Customer;

    @ManyToOne(type => Customer, c => c.id)
    @JoinColumn({
        name: "to",
        referencedColumnName: "id"
    })
    public to!: Customer;

    @ManyToOne(type => Ticketstate, ts => ts.id)
    @JoinColumn({
        name: "state",
        referencedColumnName: "id"
    })
    public state!: Ticketstate;

    @ManyToMany(type => Message, m => m.id)
    @JoinTable({
        name: "ticketmessages",
        joinColumn: {
            name: "owner",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "message",
            referencedColumnName: "id"
        }
    })
    public messages!: Message[];
}

export default Ticket;