import 'reflect-metadata'
import { BaseEntity, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Connection, EntityManager, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import User from './user';
type ObjectFunctions = () => Promise<void>;

type FunctionObject = Record<string, ObjectFunctions>;

@Entity({
    database: "testdb",
    name: "images"
})
class Image {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column('varchar')
    public imageName!: string;

    @ManyToOne(type => User, u => u.id )
    @JoinColumn({ name: "user", referencedColumnName: "id" })
    public user!: User;
}

export default Image;