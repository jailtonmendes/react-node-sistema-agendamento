import { NextFunction, Request, Response } from "express";
import { UsersServices } from "../services/UsersServices";
import { s3 } from "../config/aws";
import { v4 as uuid } from 'uuid'

// RESPONSAVEL POR RECEBER REQUISIÇÕES E PASSAR PARA QUEM DE DeviceOrientationEvent, SERVICES...""

class UserController{

    private userServices: UsersServices

    constructor() {
        this.userServices = new UsersServices()
    }

    index(){
        //buscar todos
    }
    show(){
        //buscar somente um
    }

    // Criar usuário
    async store(request: Request, response: Response, next: NextFunction){
        //criar
        const { name, email, password } = request.body;
        try {
            const result = await this.userServices.create({ name, email, password });

            return response.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    //Login
    async auth(request: Request, response: Response, next: NextFunction){
        const { email, password } = request.body;
        try {
            const result = await this.userServices.auth(email, password)
            return response.json(result);

        } catch (error) {
            next(error);
        }
    }

    //Refresh Token
    async refresh(request: Request, response: Response, next: NextFunction) {
        const { refresh_token } = request.body;
        try {
            const result = await this.userServices.refresh(refresh_token)
            return response.json(result);

        } catch (error) {
            next(error);
        }
    }

    // Atualizar usuário
    async update(request: Request, response: Response, next: NextFunction) {
        const { name, oldPassword, newPassword } = request.body;
        const { user_id } = request;

        try {

            const result = await this.userServices.update({name, oldPassword, newPassword, avatar_url:request.file, user_id});
            
            return response.status(200).json(result);
            
        } catch (error) {
            next(error);
        }
    }


}

export { UserController }
