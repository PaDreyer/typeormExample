import 'reflect-metadata'
import { Connection, EntityManager } from 'typeorm';

import User from './entities/user';
import Customer from './entities/customer';
import Message from './entities/message';
import Role from './entities/role';
import Group from './entities/group';
import Image from './entities/image';
import Ticket from './entities/ticket';
import Ticketstate from './entities/ticketstate';

type ObjectFunctions = () => Promise<void>;

type FunctionObject = Record<string, ObjectFunctions>;


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
            Message,
            Customer,
            Role,
            Ticket,
            Ticketstate,
        ],
        synchronize: true,
        cache: false
    })

    await connection.connect();

    const manager = new EntityManager(connection);

    const functionObj : FunctionObject = {
        users: async () => {
            const imageResults = await manager.find(User, { relations: [ "images", "friends" , "friends.friends", "friends.friends.friends", "outbound", "inbound", "groups", "groups.member", "groups.messages", "customer", "customer.role", "customer.mandants", "customer.employee" ]});
            console.log("users: ", JSON.stringify(imageResults[0], null, 2))
        },
        images: async () => {
            const imageResults = await manager.find(Image, { relations: [ "user", "user.friends", "user.friends.friends" ] });
            console.log("images: ", JSON.stringify(imageResults[0], null, 2))
        },
        messages: async () => {
            const imageResults = await manager.find(Message, { relations: [ "owner", "receipent", "group" ]});
            console.log("messages: ", JSON.stringify(imageResults, null, 2));
        },
        groups: async () => {
            const imageResults = await manager.find(Group, { relations: [ "messages", "member", "member.groups" ]});
            console.log("groups: ", JSON.stringify(imageResults, null, 2));
        },
        customers: async () => {
            const imageResults = await manager.find(Customer, { relations: [ "mandants", "role", "inboundTickets", "outboundTickets" ]});
            console.log("customers: ", JSON.stringify(imageResults, null, 2));
        },
        tickets: async () => {
            const imageResults = await manager.find(Ticket, { relations: [ "from", "to", "state", "messages" ]});
            console.log("tickets: ", JSON.stringify(imageResults, null, 2));
        },
        ticketstates: async () => {
            const imageResults = await manager.find(Ticketstate, {});
            console.log("ticketstates: ", JSON.stringify(imageResults, null, 2));
        },
        roles: async () => {
            const imageResults = await manager.find(Role, {});
            console.log("roles: ", JSON.stringify(imageResults, null, 2));
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

