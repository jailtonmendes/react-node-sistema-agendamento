import { ICreate } from "../interfaces/SchedulesInterface";
import { getHours, isBefore, startOfHour } from 'date-fns'
import { SchedulesRepository } from "../repositories/ServicesRepository";

class SchedulesServices {
    private schedulesRepository = new SchedulesRepository();

    constructor() {
        this.schedulesRepository = new SchedulesRepository();
    }

    async create({ name, phone, date, user_id }: ICreate) {
        // Formatando a data enviada na requisição
        const dateFormatted = new Date(date);
        const hourStart = startOfHour(dateFormatted);

        // Definindo hora de inicio e termino do agendamento
        const hour = getHours(hourStart)
        if(hour <= 9 || hour >= 19) {
            throw new Error("Create Aschedule between 9 and 19");
            
        }

        // Validando se Data informada é menor que hora atual
        if(isBefore(hourStart, new Date())) {
            throw new Error("It is not allwed to chedule old date");
        }

        // Verificar se horário está disponivel
        const checkIsAvailable = await this.schedulesRepository.find(hourStart, user_id);

        if(checkIsAvailable) {
            throw new Error("Schedule date is not available");
        }

        // se tudo der certo
        const create = await this.schedulesRepository.create({name, phone, date: hourStart, user_id});

        return create;
    }

    async index(date: Date) {
        const result = await this.schedulesRepository.findAll(date);
        console.log("🚀 ~ file: SchedulesService.ts:37 ~ SchedulesServices ~ index ~ result:", result);
        return result;
    }

    async update(id: string, date: Date, user_id: string) {
        const dateFormatted = new Date(date);
        const hourStart = startOfHour(dateFormatted);

        // Validando se Data informada é menor que hora atual
        if(isBefore(hourStart, new Date())) {
            throw new Error("It is not allwed to chedule old date");
        }

        // Verificar se horário está disponivel
        const checkIsAvailable = await this.schedulesRepository.find(hourStart, user_id);

        if(checkIsAvailable) {
            throw new Error("Schedule date is not available");
        }

        const result = await this.schedulesRepository.update(id, date);
        return result;
    }
}

export { SchedulesServices }