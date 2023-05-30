import { prisma } from "../database/prisma";
import { Icreate } from "../interfaces/UsersInterface";



class UsersRepository {

    async create({ name, email, password }: Icreate) {
        const result = await prisma.user.create({
            data: {
                name,
                email,
                password,
            
            },
        });
        return result;
    }

    async findUserByEmail(email: string) {
        const result = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        return result;
    }

    async findUserById(id: string) {
        const result = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        return result;
    }

    async update(name: string, avatar_url: string, user_id: string) {
        const result = await prisma.user.update({
            where: {
                id: user_id,
            },
            data: {
                name,
                avatar_url,

            },
        });

        return result
    }

    async updatePassword(newPassword: string, user_id: string) {
        const result = await prisma.user.update({
            where: {
                id: user_id,
            },
            data: {
                password: newPassword,

            },
        });

        return result
    }
}

export { UsersRepository }