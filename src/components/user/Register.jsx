import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global';
import { useNavigate } from 'react-router-dom'

export const Register = () => {
    const navegar=useNavigate();
    const{form,changed}=useForm({});
    const [saved,setSaved]=useState("not_sended");


    const saveUser=async(e)=>{
        e.preventDefault();

        //recoger datos del formulario
        let newUser=form;

        //guardar usuario en el backend
        const request=await fetch(Global.url+"user/register",{
            method:"POST",
            body:JSON.stringify(newUser),
            headers:{
                "Content-type":"application/json"
            }
        });

        const data=await request.json();
        if(data.status=="success"){
            setSaved("saved");
        }else{
            setSaved("error");
        }
    }

    const  button_login=(e)=>{
        navegar("/login",{replace:true});
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Registro</h1>
            </header>

            <div className="content__posts">

                <strong className='alert alert-success'>{saved=="saved"?"Usuario registrado correctamente":""}</strong>
                <strong className='alert alert-danger'>{saved=="error"?"El usuario no se pudo registrar":""}</strong>

                {saved=="not_sended"?
                <form className='register-form0' onSubmit={e=>saveUser(e)}>
                    <div className="form-group">
                        <label htmlFor='name'>Nombre</label>
                        <input type='text' name='name' onChange={changed}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor='surname'>Apellidos</label>
                        <input type='text' name='surname' onChange={changed}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor='nick'>Nick</label>
                        <input type='text' name='nick' onChange={changed}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor='email'>Email</label>
                        <input type='email' name='email' onChange={changed}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor='password'>Contraseña</label>
                        <input type='password' name='password' onChange={changed}/>
                    </div>
                    <input type='submit' value="Registrate" className='btn btn-success'/>
                </form>
                        :<button className='btn btn-success' onClick={e=>button_login(e)}>Ir al login</button>}
            </div>
        </>
    )
}
