import React from 'react'
import { Routes, Route, BrowserRouter, Navigate, NavLink } from 'react-router-dom';
import { PublicLayout } from '../components/layout/public/PublicLayout';
import { Login } from '../components/user/Login';
import { Register } from '../components/user/Register';
import { PrivateLayout } from '../components/layout/private/PrivateLayout';
import { Feed } from '../components/publication/Feed';
import { AuthProvider } from '../context/AuthProvider';
import { People } from '../components/user/People';
import { Ajustes } from '../components/user/Ajustes';
import { Followers } from '../components/follow/Followers';
import { Following } from '../components/follow/Following';
import { Profile } from '../components/user/Profile';
export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<PublicLayout />}>
                        <Route index element={<Login />} />
                        <Route path='login' element={<Login />} />
                        <Route path='registro' element={<Register />} />
                    </Route>

                    <Route path='/social' element={<PrivateLayout />}> {/**todas las rutas que empiecen por social */}
                        <Route index element={<Feed />} />
                        <Route path='feed' element={<Feed />} />
                        <Route path='people' element={<People/>}/>
                        <Route path='ajustes' element= {<Ajustes/>}/>
                        <Route path='followers/:userId' element={<Followers/>}/>
                        <Route path='following/:userId' element={<Following/>}/>
                        <Route path='perfil/:userId' element={<Profile/>}/>
                    </Route>

                    <Route path="*" element={
                        <p>
                            <h1>Error 404</h1>
                            <NavLink to="/">Volver</NavLink>
                        </p>
                    } />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
