import 'reflect-metadata'
import { BaseEntity, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Connection, EntityManager, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

type ObjectFunctions = () => Promise<void>;

type FunctionObject = Record<string, ObjectFunctions>;

@Entity({
    database: "testdb",
    name: "ticketstates"
})
class Ticketstate {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column('varchar')
    public name!: string;
}

export default Ticketstate;