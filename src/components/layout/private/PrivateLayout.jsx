import React from 'react'
import { Header } from '../private/Header'
import { Navigate, Outlet } from 'react-router-dom'
import { SideBar } from './SideBar'
import useAuth from '../../../hooks/useAuth'


export const PrivateLayout = () => {
    const { auth,loading } = useAuth();

    if(loading){
        return <h1>CARGANDO</h1>
    }else{
    return (
        <>
            {/**Layout */}

            {/**Cabecera y navegacion */}
            <Header />

            {/**contenido principal */}
            <section className='layout_content'>
                {auth._id ?
                    <Outlet />
                    : <Navigate to="/login" />
                }
            </section>

            {/**barra lateral */}
            <SideBar />


        </>
    )
}
}