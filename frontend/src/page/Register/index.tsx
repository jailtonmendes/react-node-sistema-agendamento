import style from './Register.module.css';
import logo from '../../assets/logo.webp'
import { Input } from '../../components/input';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { BsPerson, BsKey } from 'react-icons/bs'
import { AiOutlineMail} from 'react-icons/ai'
import { api } from '../../server';

interface IFormValues {
    email: String;
    name: String;
    password: String;
}


export function Register() {

      // Validação de campos - YUP
      const schema = yup.object().shape({
        email: yup.string().email('Digite um email válido').required("Campo de email obrigatório"),
        password: yup.string().required('Campo de senha obrigatório'),
    });

    const {register, handleSubmit, formState: {errors} } = useForm<IFormValues>({resolver: yupResolver(schema)})

    const submit = handleSubmit(async (data) => {
        const result = await api.post('/users', {
            name: data.name,
            email: data.email,
            password: data.password
        });
        
        console.log("🚀 ~ file: index.tsx:36 ~ submit ~ result:", result)

    });

    return (
        <div className={style.background}>
            <div className="container">
                <p className={style.navigate}> <Link to={'/'}>Home</Link> {'>'} Área de Cadastro </p>

                <div className={style.wrapper}>

                <div className={style.imageContainer}>
                    <img src={logo} alt="Logo" />
                </div>
                <div className={style.card}>
                    <h2>Área de Cadastro</h2>
                    <form onSubmit={submit}>
                        <Input 
                            placeholder='Nome'
                            type='text' 
                            {...register('name', { required: true})}
                            error={errors.name && errors.name.message}
                            icon={<BsPerson size={20}/>}
                        />
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
                         icon={<BsKey size={20}/>
                        }
                        />
                        <Button text='Cadastrar' />
                    </form>
                    <div className={style.register}>
                        <span>Já tem cadastro? <Link to={'/'}>Voltar à Página Inicial</Link> </span>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}