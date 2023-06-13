import { compare, hash } from "bcrypt";
import { IUpdate, Icreate } from "../interfaces/UsersInterface";
import { UsersRepository } from "../repositories/UsersRepository"
import { s3 } from "../config/aws";
import { v4 as uuid } from 'uuid'
import { sign, verify } from "jsonwebtoken";


class UsersServices {
    private userRepository: UsersRepository;

    constructor() {
        this.userRepository = new UsersRepository();
    }
    async create({ name, email, password }: Icreate) {

        // Verificando se já existe email cadastrado no banco
        const findUser = await this.userRepository.findUserByEmail(email);

        if (findUser) {
            throw new Error('User exixts')
        }
        // Encriptografando a senha
        const hasPassword = await hash(password, 10);

        const create = await this.userRepository.create({ 
            name, 
            email, 
            password: hasPassword, 
        });
        return create;
    }

    async update({name, oldPassword, newPassword, avatar_url, user_id}: IUpdate) {

        let password

        if(oldPassword && newPassword) {
            // Bucando usuário por ID
            // Se não tiver retorna mensagem
            const findUserById = await this.userRepository.findUserById(user_id);

            if(!findUserById) {
                throw new Error("User not found");
            }
            // Comparando Senha digitada com senha no cadastrada
            const passwordMatch = compare(oldPassword, findUserById.password);
            if(!passwordMatch) {
                throw new Error("User or password invalid");
            }

            // Encriptografando nova senha antes de mandar para API
            const password = await hash(newPassword, 10);
            await this.userRepository.updatePassword(password, user_id);
        }

        // Caso usuário tenha passado nova imagem
        if(avatar_url) {
            // Salvando Imagem na WS
            const uploadImage = avatar_url?.buffer
            const uploadS3 = await s3.upload({
                Bucket: 'sistema-agendamento',
                Key: `${uuid()}-${avatar_url?.originalname}`,
                // ACL: 'public-read',
                Body: uploadImage
            }).promise();

            await this.userRepository.update(name, uploadS3.Location, user_id);
        }

        return {
            message: 'User updated successfully',
        }

    }


    async auth(email: string, password: string) {
        // Verificando se email informado contem usuário no banco
        const findUser = await this.userRepository.findUserByEmail(email);

        // Se não tiver retorna mensagem
        if(!findUser) {
            throw new Error("User or password invalid");
        }

        // Comparando senha passada com senha no banco
        const passwordMatch = compare(password, findUser.password);

        // Se senha não for igual retorna mensagem 
        if(!passwordMatch) {
            throw new Error("User or password invalid");
        }

        // Validando se há token para realizar autenticação
        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
        if(!secretKey) {
            throw new Error("There is no token key");
        }


        const token = sign({email}, secretKey, {
            subject: findUser.id,
            expiresIn: 60 * 15, //Tempo de expiração do token
        });

        const refreshToken = sign({email}, secretKey, {
            subject: findUser.id,
            expiresIn: '7d', //Tempo de expiração do refreshToken = 7 Dias
        });

        return {
            token,
            refresh_token: refreshToken,
            user: {
                name: findUser.name,
                email: findUser.email,
                avatar_url: findUser.avatar_url,
            }
        }

    }

    // Refresh Token
    async refresh(refresh_token: string) {
        if(!refresh_token) {
            throw new Error("Refresh token missing");
        }

        let secretKeyRefresh: string | undefined = process.env.ACCESS_KEY_TOKEN_REFRESH;
        if(!secretKeyRefresh) {
            throw new Error("There is no refresh token key");
        }

        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN_REFRESH;
        if(!secretKey) {
            throw new Error("There is no refresh token key");
        }

        const verifyRefreshToken = verify(refresh_token, secretKey);

        const { sub } = verifyRefreshToken;

        const newToken = sign({sub}, secretKey, {
            expiresIn: '1h',
        });
        const refreshToken = sign({ sub }, secretKeyRefresh, {
            expiresIn: '7d'
        })
        return { token: newToken, refresh_token: refreshToken};
    }
}

export { UsersServices }