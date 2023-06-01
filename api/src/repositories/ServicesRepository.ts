import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "../database/prisma"
import { ICreate } from "../interfaces/SchedulesInterface";
import { lt } from "date-fns/locale";

class SchedulesRepository {
    async create({name, phone, date, user_id}: ICreate) {
        const result = await prisma.schedule.create({
            data: {
                name,
                phone,
                date,
                user_id
            },
        });
        return result;
    }

    // Realizar consulta no banco e verificar se já existe data informada no banco
    async find(date: Date, user_id: string) {
        const result = await prisma.schedule.findFirst({
            where: { date, user_id },
        });
        return result;
    }

    async findAll(date: Date) {
        const result = await prisma.schedule.findMany({ //FindMany = Buscar Todos
            where: {
                date: {
                    gte: startOfDay(date), //Hora Inicial
                    lt: endOfDay(date) //Hora Final
                },
            },
            orderBy: { //Ordenando por data - crescente
                date: 'asc',
            },
        });
        return result;
    }

    async update(id: string, date: Date) {
        const result = await prisma.schedule.update({
            where: {
                id,
            },
            data: {
                date,
            },
        });
        return result;
    }
}

export { SchedulesRepository }