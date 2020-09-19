import 'reflect-metadata'
import { BaseEntity, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Connection, EntityManager, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import Role from './role';
import Ticket from './ticket';
import User from './user';
import Message from './message';

type ObjectFunctions = () => Promise<void>;

type FunctionObject = Record<string, ObjectFunctions>;

@Entity({
    database: "testdb",
    name: "customers"
})
class Customer {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column('varchar')
    public name!: string;

    @ManyToOne(type => Role, r => r.id)
    @JoinColumn({
        name: "role",
        referencedColumnName: "id"
    })
    public role!: Role;

    @OneToMany(type => User, u => u.customer)
    public employee!: User[];

    @ManyToMany(type => Customer, c => c.id)
    @JoinTable({
        joinColumn: {
            name: "customer",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "mandant",
            referencedColumnName: "id"
        }
    })
    public mandants!: Customer[];

    @OneToMany(type => Ticket, t => t.to)
    public inboundTickets!: Ticket[];

    @OneToMany(type => Ticket, t => t.from)
    public outboundTickets!: Ticket[];

    @ManyToMany(type => Message, m => m.id)
    @JoinTable({
        name: "customermessages",
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

export default Customer;