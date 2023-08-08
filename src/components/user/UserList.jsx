import React from 'react'
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import { NavLink } from 'react-router-dom';


export const UserList = ({ users, setUsers, following, setFollowing, loading, more, setMore, page, setPage, get_user }) => {
    const { auth } = useAuth();
    const follow = async (userId) => {
        //peticion del backend para guardar el follow
        const request = await fetch(Global.url + "follow/save", {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })
        const data = await request.json();

        //cuando este todo correcto
        if (data.status == "success") {
            //agregar un nuevo follow
            setFollowing([...following, userId]);
        }

    }

    const unfollow = async (userId) => {
        //peticion del backend para borrar el follow
        const request = await fetch(Global.url + "follow/unfollow/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })
        const data = await request.json();
        //cuando este todo correcto
        if (data.status == "success") {
            //Actualizar el estado de following, filtrando lso datos para eliminar el antiguo follow (userId que acabo de dejar de seguir)
            setFollowing(following.filter(id => id !== userId));
        }
    }

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        get_user(next);
        console.log(following);
    }


    return (
        <div>
            <div className="content__posts">

                {users.map(user => {
                    return (
                        <article key={user._id} className="posts__post">
                            <article className="post__container">

                                <div className="post__image-user">
                                    <NavLink to={"/social/perfil/" + user._id} className="post__image-link">
                                        {user.image != "default.png" ? <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />
                                            : (<><img src={avatar} className="post__user-image" alt="Foto de perfil" /></>)}
                                    </NavLink>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <NavLink to={"/social/perfil/" + user._id} className="user-info__name">{user.name + " " + user.surname}</NavLink>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date">{user.created_at}</a>
                                    </div>

                                    <h4 className="post__content">{user.bio}</h4>

                                </div>

                            </article>

                            {/**el user._id!=auth._id es para que no me salgan los botones a mi mismo */}
                            {user._id != auth._id &&
                                <div className="post__buttons">

                                    {!following.includes(user._id) &&
                                        <a href="#" className="post__button post__button--green" onClick={() => follow(user._id)}>
                                            Seguir
                                        </a>
                                    }

                                    {following.includes(user._id) &&
                                        <a href="#" className="post__button" onClick={() => unfollow(user._id)}>
                                            Dejar de seguir
                                        </a>
                                    }

                                </div>
                            }

                        </article>

                    )
                })}

                {loading ? <h1>Cargando...</h1> : ""}
            </div>
            {more &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={e => nextPage()}>
                        Ver mas personas
                    </button>
                </div>
            }
            <br />
        </div>
    )
}
