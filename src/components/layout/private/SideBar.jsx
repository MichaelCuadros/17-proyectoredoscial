import React, { useState } from 'react'
import avatar from '../../../assets/img/user.png'
import useAuth from '../../../hooks/useAuth'
import { Global } from '../../../helpers/Global';
import { Link, json } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';

export const SideBar = () => {
    const { auth, counters } = useAuth();
    const { form, changed } = useForm({});
    const [stored, setStored] = useState("not-stored")

    const savePublication = async (e) => {
        e.preventDefault();
        //recoger datos del formulario
        let newPublication = form;
        newPublication.user = auth._id;

        //Hacer request para guardar en bd
        const request = await fetch(Global.url + "publication/save", {
            method: 'POST',
            body: JSON.stringify(newPublication),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })
        const data = await request.json();
        console.log(data);

        //Mostrar mensaje de exito o error
        if (data.status == "success") {
            setStored("stored");
        } else {
            setStored("error");
        }

        //subir imagen
        const fileInput=document.querySelector("#file");

        if(data.status==="success"&&fileInput.files[0]){
            const formData=new FormData();
            formData.append("file0",fileInput.files[0]);

            const uploadRequest=await fetch(Global.url+"publication/upload/"+data.publication_to_save._id,{
                method:"POST",
                body:formData,
                headers:{
                    "Authorization": localStorage.getItem("token")
                }
            });
            const uploadData=await uploadRequest.json();
            console.log(uploadData);
            if(uploadData.status=="success"){
                setStored("stored");
            }else{
                setStored("error");
            }

            //para vaciar el formulario cuando todo este bien
            if(data.status=="success"&&uploadData.status=="success"){
                const myForm=document.querySelector('#publication-form');
                myForm.reset();//para vaciar formulario
            }
        }
    }

    return (
        <>

            <aside className="layout__aside">

                <header className="aside__header">
                    <h1 className="aside__title">Hola, {auth.name}</h1>
                </header>

                <div className="aside__container">

                    <div className="aside__profile-info">

                        <div className="profile-info__general-info">
                            <div className="general-info__container-avatar">
                                {auth.image != "default.png" ? <img src={Global.url + "user/avatar/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />
                                    : (<><img src={avatar} className="container-avatar__img" alt="Foto de perfil" /></>)}
                            </div>

                            <div className="general-info__container-names">
                                <Link to={"/social/perfil/"+auth._id} className="container-names__name">{auth.name}</Link>
                                <p className="container-names__nickname">{auth.nick}</p>
                            </div>
                        </div>

                        <div className="profile-info__stats">

                            <div className="stats__following">
                                <Link to={"following/" + auth._id} href="#" className="following__link">
                                    <span className="following__title">Siguiendo</span>
                                    <span className="following__number">{counters.following}</span>
                                </Link>
                            </div>
                            <div className="stats__following">
                                <Link to={"followers/" + auth._id} href="#" className="following__link">
                                    <span className="following__title">Seguidores</span>
                                    <span className="following__number">{counters.followed}</span>
                                </Link>
                            </div>


                            <div className="stats__following">
                                <Link to={"/social/perfil/"+auth._id} href="#" className="following__link">
                                    <span className="following__title">Publicaciones</span>
                                    <span className="following__number">{counters.publications}</span>
                                </Link>
                            </div>


                        </div>
                    </div>


                    <div className="aside__container-form">

                        {stored == "stored" ?
                            <strong>Publicación enviada</strong> : ("")
                        }
                        {stored == "error" ?
                            <strong>No se pudo enviar la publicación</strong> : ("")
                        }


                        <form id='publication-form' className="container-form__form-post" onSubmit={savePublication}>

                            <div className="form-post__inputs">
                                <label htmlFor="text" className="form-post__label">¿Que estas pesando hoy?</label>
                                <textarea name="text" className="form-post__textarea" onChange={changed}></textarea>
                            </div>

                            <div className="form-post__inputs">
                                <label htmlFor="file" className="form-post__label">Sube tu foto</label>
                                <input type="file" name="file0" id="file" className="form-post__image" />
                            </div>

                            <input type="submit" value="Enviar" className="form-post__btn-submit" />

                        </form>

                    </div>

                </div>

            </aside>
        </>
    )
}
