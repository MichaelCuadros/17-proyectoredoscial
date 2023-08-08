import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/img/user.png'

export const PublicationList = ({
    publications,
    getPublications,
    page,
    setPage,
    more,
    setMore,
    user,
    params
}
) => {
    const {auth}=useAuth();

    const nextPage=()=>{
        let next=page+1;
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


    return (
        <>
            <div className="content__posts">

                {publications.map(publication => {
                    return (
                        <article key={publication._id} className="posts__post">

                            <div className="post__container">

                                <div className="post__image-user">
                                    {user.image != "default.png" ? <img src={Global.url + "user/avatar/" + user.image} className="container-avatar__img" alt="Foto de perfil" />
                                        : (<><img src={avatar} className="container-avatar__img" alt="Foto de perfil" /></>)}
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <a href="#" className="user-info__name">{user.name}</a>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date">{publication.create_at}</a>
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
