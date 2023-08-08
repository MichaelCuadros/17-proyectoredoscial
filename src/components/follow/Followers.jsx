import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';
import { UserList } from '../user/UserList'
import useAuth from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { getProfile } from '../../helpers/GetProfile';

export const Followers = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();
    const params = useParams();//para sacar parametros de el link
    const [profile,setProfile]=useState("");
    useEffect(() => {
        get_user(1);
        getProfile(params.userId,setProfile);
    }, []);

    const get_user = async (nextPage = 1) => {

        //efecto de cargando
        setLoading(true);

        //Sacar uerID de la url
        const userId = params.userId;

        //Primero hacer peticion para sacar usuarios
        const request = await fetch(Global.url + 'follow/followers/' + userId + '/' + nextPage, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });


        const data = await request.json();
        console.log(data);
        //recorrer y limpiar follows para quedarme con followed
        let CleanUsers = [];
        data.follows.forEach(follow => {
            CleanUsers = [...CleanUsers, follow.user]
        })
        data.usuarios = CleanUsers;
        console.log(data);

        //crear un estado para poder listarlos
        if (data.usuarios && data.status == "success") {

            let newUsers = data.usuarios;


            if (users.length >= 1) {
                newUsers = [...users, ...data.usuarios]
            }
            setUsers(newUsers);
            setFollowing(data.user_following);
            //cargando se desactiva
            setLoading(false);
        }

        //paginacion boton mas personas
        if (users.length >= (data.total - data.usuarios.length)) {
            setMore(false);
        }

    }


    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Seguidores de  {profile}</h1>
            </header>

            {/**pasamos props */}
            <UserList users={users} setUsers={setUsers}
                following={following} setFollowing={setFollowing} loading={loading}
                more={more} setMore={setMore} page={page} setPage={setPage} get_user={get_user} />



        </>
    )
}
