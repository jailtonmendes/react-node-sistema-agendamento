import style from  './Card.module.css'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FaEdit } from 'react-icons/fa'
import { getHours, isAfter } from 'date-fns';
import { useState } from 'react';
import { ModalEdit } from '../ModalEdit'

interface ISchedule {
    name: string;
    phone: string;
    date: Date;
    id: string;
}

export const Card = ({name, date, id, phone}: ISchedule) => {
    const isAfterDate = isAfter(new Date(date), new Date()); //Verificcando se data da marcação já passou
    const [openModal, setOpenModal] = useState<boolean>(false);
    
    let phoneFormatted = phone.replace(/\D/g, '');
    phoneFormatted = phoneFormatted.replace(
        /(\d{2})(\d{5})(\d{4})/, '($1) $2-$3',
    );

    const handleChangeModal = () => {
        setOpenModal(!openModal)
    }

    return (
        <>
        <div className={style.background}>

            <div>
                <span className={`${!isAfterDate && style.disabled}`}>{getHours(new Date(date))}h</span>
                <p>{name} - {phoneFormatted}</p>
            </div>
            <div className={style.icons}>
                <FaEdit  color="#5F68B1" size={17} onClick={() => isAfterDate && handleChangeModal()} />
                <RiDeleteBin6Line color="#EB2E2E" size={17}/>
            </div>
        </div>

        <ModalEdit isOpen={openModal} handleChangeModal={handleChangeModal} />

        </>
    )
}