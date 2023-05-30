import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
interface IPayload {
    sub: string
}

class AuthMiddleware {
    
    auth(request: Request, response: Response, next: NextFunction) {
        const authHeader = request.headers.authorization;
        if(!authHeader) {
            return response.status(401).json({
                code: 'token.missing',
                message: 'Token missing'
            });
        }

        // Separando o Bearer token, e pegando somento o token Exemplo: Bearer [ejgyjguosujfgnf,khfhyhvcC978DS454F8DS778]
        const [, token] = authHeader.split(' ');
             // Validando se há token para realizar autenticação
             let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
             if(!secretKey) {
                 throw new Error("There is no token key");
             }

        try {
            // Verificando se token é válido
            const { sub } = verify(token, secretKey) as IPayload;
            request.user_id = sub;
            return next()

        } catch (error) {
            return response.status(401).json({
                code: 'token.expired',
                message: 'Token expired.',
            });
        }
    }

}

export { AuthMiddleware }