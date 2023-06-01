import { NextFunction, Request, Response } from "express";
import { SchedulesServices } from "../services/SchedulesService";
import { parseISO } from "date-fns";

class SchedulesController {
    private schedulesServices: SchedulesServices;
    constructor() {
        this.schedulesServices = new SchedulesServices();
    }
    async store(request: Request, response: Response, next: NextFunction) {
        const { name, phone, date } = request.body; //Obtendo name, phone, date da requisição
        const { user_id } = request;

        try {
            const result = await this.schedulesServices.create({name, phone, date, user_id})

            return response.status(201).json(result);
            
        } catch (error) {
            next(error)
            
        }

    }

    async index(request: Request, response: Response, next: NextFunction){

        // Exemplo localhost:3000/chedules?date=31/05/2023
        const { date } = request.query;
        const parseDate = date ? parseISO(date.toString()) : new Date();
        try {
            const result = await this.schedulesServices.index(parseDate);

            return response.json(result);
            
        } catch (error) {
            next(error);
        }
    };

    async update(request: Request, response: Response, next: NextFunction){
        const { id } = request.params;
        const { date } = request.body;
        const { user_id } = request;
        try {
            const result = await this.schedulesServices.update(id, date, user_id)

            return response.json(result)

        } catch (error) {
            next(error)
        }
    };

    delete(request: Request, response: Response, next: NextFunction){};


}

export { SchedulesController }