import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';
import { UserList } from './UserList';

export const People = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    get_user(1);
  }, []);

  const get_user = async (nextPage = 1) => {

    //efecto de cargando
    setLoading(true);

    //Primero hacer peticion para sacar usuarios
    const request = await fetch(Global.url + 'user/list/' + nextPage, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();



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
        <h1 className="content__title">Gente</h1>
      </header>

      {/**pasamos props */}
      <UserList users={users} setUsers={setUsers}
        following={following} setFollowing={setFollowing} loading={loading} 
        more={more} setMore={setMore} page={page} setPage={setPage} get_user={get_user}/>



    </>
  )
}
