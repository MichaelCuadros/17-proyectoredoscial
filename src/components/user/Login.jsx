import React from 'react'
import { useForm } from '../../hooks/useForm'
import {Global} from '../../helpers/Global'
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';
export const Login = () => {

    const { form, changed } = useForm({});
    const {setAuth}=useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const Login =async (e) => {
        e.preventDefault();
        setIsLoading(true); // Cambia el estado a "cargando"

        let newUser = form;

        //logearte
        const request = await fetch(Global.url + "user/login", {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-type": "application/json"
            }
        });
        const data=await request.json();
        console.log(data.user.token);
        setIsLoading(false); // Cambia el estado de vuelta a "no cargando"
        //Persistir los datos en el navegador
        if(data.status=="success"){
            //en el localstoraged guardar token y usuario
            localStorage.setItem("token",data.user.token);
            await delete data.user.token;//para que no se guarde el token en el campo user del localstorage
            localStorage.setItem("user",JSON.stringify(data.user));//PARA GUARDAR UN OBJETO EN EL LOCALSTORAge es necesario el stringify

            //set datos en el auth
            setAuth(data.user);//aunq ya lo hace, no es necesario al parecer pero por las dudas

            //redireccion
            window.location.reload();
        }else {
            setError('Fallo al autenticarse'); // Establece el mensaje de error
        }
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Login</h1>
            </header>

            <div className="content__posts">
                <form className='form-login' onSubmit={e => Login(e)}>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type='text' name='email' onChange={changed} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' name='password' onChange={changed} />
                    </div>
                    <input type='submit' value="Identificate" className='btn btn-success' />
                </form>
                {isLoading && <p>Cargando...</p>}
            {error && <p>{error}</p>}
            </div>
        </>
    )
}
