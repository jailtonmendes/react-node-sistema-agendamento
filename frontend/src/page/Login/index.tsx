import style from './Login.module.css';
import logo from '../../assets/logo.webp'
import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';
import { BsKey } from 'react-icons/bs';
import { AiOutlineMail } from 'react-icons/ai';

interface IFormValues {
    email: String;
    password: String;
}

export function Login() {

    // Validação de campos - YUP
    const schema = yup.object().shape({
        email: yup.string().email('Digite um email válido').required("Campo de email obrigatório"),
        password: yup.string().required('Campo de senha obrigatório'),
    });

    const {register, handleSubmit, formState: {errors} } = useForm<IFormValues>({resolver: yupResolver(schema)})

    const submit = handleSubmit((data) => {
    console.log("🚀 ~ file: index.tsx:21 ~ submit ~ data:", data)

    });
    

    return (
        <div className={style.background}>
            <div className={`container ${style.container}`}>
                <div className={style.wrapper}>

                <div>
                    <img src={logo} alt="Logo" />
                </div>
                <div className={style.card}>
                    <h2>Olá, seja bem vindo</h2>
                    <form onSubmit={submit}>
                        <Input 
                            placeholder='Email'
                            type='text' 
                            {...register('email', { required: true})}
                            error={errors.email && errors.email.message}
                            icon={<AiOutlineMail size={20}/>}
                            />
                        <Input 
                         placeholder='Senha'
                         type="password" 
                         {...register('password', { required: true})}
                         error={errors.password && errors.password.message}
                         icon={<BsKey size={20}/>}
                        />
                        <Button text='Entrar' />
                    </form>
                    <div className={style.register}>
                        <span>Ainda não tem conta? <Link to={'/register'}>Cadsatre-se</Link> </span>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}