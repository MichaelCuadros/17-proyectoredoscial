import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { Link, NavLink, useParams } from 'react-router-dom'
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import ReactTimeAgo from 'react-time-ago'

export const Feed = () => {
    const params = useParams();
    const [user, setUser] = useState({});
    const { auth } = useAuth();
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    useEffect(() => {
        getPublications(1, true);
        console.log(publications);
    }, []);

    const getPublications = async (nextPage = 1) => {
        const request = await fetch(Global.url + "publication/feed/" + nextPage, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const data = await request.json();
        if (data.status == "success") {
            console.log(data)
            let newPublications = data.publicationsFeed;
            if (publications.length >= 1) {
                newPublications = [...publications, ...data.publicationsFeed];

            }

            setPublications(newPublications);

            if (publications.length >= (data.total - data.publicationsFeed.length)) {
                setMore(false);
            }
        }
    }

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getPublications(next);
    }

    const delete_publication = async (idPublication) => {
        const request = await fetch(Global.url + "publication/" + idPublication, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const data = await request.json();
        if (data.status == "success") {
            console.log(data)
            setPublications(prevPublications => prevPublications.filter(publication => publication._id !== data.publication_deleted._id));
        }
    }
    const refreshPage=()=>{
                    //reload
                    window.location.reload();
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button onClick={refreshPage} className="content__button">Refrescar pagina</button>
            </header>


            <div className="content__posts">

                {publications.map(publication => {
                    return (
                        <article key={publication._id} className="posts__post">

                            <div className="post__container">


                            <div className="general-info__container-avatar">
                                {publication.user.image != "default.png" ? 
                                (<img src={Global.url + "user/avatar/" + publication.user.image} className="container-avatar__img" alt="Foto de perfil" />)
                                    : (<><img src={avatar} className="container-avatar__img" alt="Foto de perfil" /></>)}
                            </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <Link to={"/social/perfil/"+publication.user._id} className="user-info__name">{publication.user.name}</Link>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date"><ReactTimeAgo date= {publication.create_at} locale="es-ES"/></a>
                                    </div>

                                    <h4 className="post__content">{publication.text}</h4>

                                    {publication.file && <img src={Global.url + "publication/media/" + publication.file} />}

                                </div>

                            </div>


                            <div className="post__buttons">

                                {(auth._id == params.userId) ?
                                    (
                                        <button href="#" onClick={e => delete_publication(publication._id)} className="post__button">
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    ) : ""}


                            </div>

                        </article>
                    )
                })}

            </div>
            {more == true ? (
                <div className="content__container-btn">
                    <button onClick={nextPage} className="content__btn-more-post">
                        Siguiente pagina
                    </button>
                </div>) : ""}
        
        </>
    )
}
