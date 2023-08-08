import React, { useEffect, useState } from 'react'
import avatar from "../../assets/img/user.png"

import { Link, NavLink, useParams } from 'react-router-dom'
import { GetProfile_full } from '../../helpers/GetProfile_full';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList';

export const Profile = () => {
    const params = useParams();
    const [counters, setCounters] = useState({});
    const [user, setUser] = useState({});
    const { auth } = useAuth();
    const [ifollow, setIfollow] = useState(false);
    const [publications, setPublications] = useState([]);
    const [page,setPage]=useState(1);
    const [more,setMore]=useState(true);

    useEffect(() => {
        GetProfile_full(params.userId, setUser)
        getCounters();
        getPublications(1,true);
    }, []);

    //para que cuando estes en un perfil y le des click a tu perfil cambie realmente de perfil se hace
    //esto
    useEffect(() => {
        GetProfile_full(params.userId, setUser)
        getCounters();
        setMore(true);
        getPublications(1,true);
    }, [params])



    const getCounters = async () => {
        const request = await fetch(Global.url + "user/counters/" + params.userId, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })
        const data = await request.json();
        if (data.status == "success") {
            setCounters(data);
        }
    }

    const getPublications = async (nextPage = 1,newProfile=false) => {
        const request = await fetch(Global.url + "publication/list/" + params.userId + "/" + nextPage, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const data = await request.json();
        if (data.status == "success") {
            console.log(data)
            let newPublications=data.publications_found;
            if(!newProfile&&publications.length>=1){
                newPublications=[...publications,...data.publications_found];

            }

            if(newProfile){
                newPublications=data.publications_found;
                setMore(true);
                setPage(1);
            }

            setPublications(newPublications);
            if(!newProfile&&publications.length>=(data.total_publications_found-data.publications_found.length)){
                setMore(false);
            }
        }
    }



    return (
        <>

            <header className="aside__profile-info">

                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {user.image != "default.png" ? <img src={Global.url + "user/avatar/" + user.image} className="container-avatar__img" alt="Foto de perfil" />
                            : (<><img src={avatar} className="container-avatar__img" alt="Foto de perfil" /></>)}
                    </div>

                    <div className="general-info__container-names">
                        <h1 href="#" className="container-names__name">{user.name} {user.surname}</h1>
                        <h2 className="container-names__nickname">{user.nick}</h2>
                        <p></p>

                    </div>

                </div>

                <div className="profile-info__stats">

                    <div className="stats__following">
                        <Link to={"/social/following/" + user._id} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.following}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/social/followers/" + user._id} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followed}</span>
                        </Link>
                    </div>


                    <div className="stats__following">
                        <Link to={"/social/perfil/" + user._id} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publications}</span>
                        </Link>
                    </div>


                </div>
            </header >



            <PublicationList 
            publications={publications}
            getPublications={getPublications}
            page={page}
            setPage={setPage}
            more={more}
            setMore={setMore}
            user={user}
            params={params}
             />


        </>
    )
}
