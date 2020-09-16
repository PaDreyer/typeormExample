import 'reflect-metadata'
import { BaseEntity, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Connection, EntityManager, JoinColumn, ManyToMany, JoinTable } from 'typeorm';


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
}

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
}

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


(async ()=>{


    const connection = new Connection({
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        type: "mysql",
        entities: [
            User,
            Image,
            Group,
            Message
        ],
        synchronize: true,
        cache: false
    })

    await connection.connect();

    const manager = new EntityManager(connection);

    const functionObj : FunctionObject = {
        user: async () => {
            const imageResults = await manager.find(User, { relations: [ "images", "friends" , "friends.friends", "friends.friends.friends", "outbound", "inbound", "groups" ]});
            console.log("user: ", JSON.stringify(imageResults[0], null, 2))
        },
        images: async () => {
            const imageResults = await manager.find(Image, { relations: [ "user", "user.friends", "user.friends.friends" ] });
            console.log("images: ", JSON.stringify(imageResults[0], null, 2))
        },
        message: async () => {
            const imageResults = await manager.find(Message, { relations: [ "owner", "receipent", "group" ]});
            console.log("messages: ", JSON.stringify(imageResults, null, 2));
        },
        group: async () => {
            const imageResults = await manager.find(Group, { relations: [ "messages", "member", "member.groups" ]});
            console.log("groups: ", JSON.stringify(imageResults, null, 2));
        }

    }

    if(Object.keys(functionObj).includes(process.argv[2])) {
        const func = functionObj[process.argv[2]];
        await func();
    } else {
        console.log("ts-node index.ts OPTION")
        console.log("##############################")
        console.log("Choose one option:")
        console.log(JSON.stringify(Object.keys(functionObj), null, 2))
    }

    connection.close();
})()

