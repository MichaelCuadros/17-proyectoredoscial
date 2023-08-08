import React from 'react'
import { useForm } from '../../hooks/useForm'
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';

export const Ajustes = () => {
  const { form, changed } = useForm({});
  const { auth,setAuth } = useAuth();


  const UpdateUser = async (e) => {
    e.preventDefault();

    //recoger datos del formulario
    let newUser = form;
    const token = localStorage.getItem("token");

    //guardar usuario en el backend
    const request = await fetch(Global.url + "user/update", {
      method: "PUT",
      body: JSON.stringify(newUser),
      headers: {
        "Content-type": "application/json",
        "Authorization": token
      }
    });
    const data = await request.json();
    delete data.userUpdate.password;
    setAuth(data.userUpdate);

    //subida de imagen
    const fileInput=document.querySelector("#file")
    if(data.status=="success"&&fileInput.files[0]){

      //recoger imagen a subir
      const formData=new FormData();
      formData.append('file0',fileInput.files[0])

      //peticion para enviar la imagen o el fichero
      const uploadRequest=await fetch(Global.url+"user/upload/",{
        method:'POST',
        body:formData,
        headers:{
          Authorization:token
        }
      });

      //para guardar la ruta en el auth
      const udata=await uploadRequest.json()
      setAuth({
        ...authprev,
       image: udata.ruta
      });

    }

    console.log(data.userUpdate);
  }

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Ajustes</h1>
      </header>
      <div className='content__posts'>
        <form className='register-form0' onSubmit={e => { UpdateUser(e) }}>
          <div className="form-group">
            <label htmlFor='name'>Nombre</label>
            <input type='text' name='name' defaultValue={auth.name} onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor='surname'>Apellidos</label>
            <input type='text' name='surname' defaultValue={auth.surname} onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor='nick'>Nick</label>
            <input type='text' name='nick' defaultValue={auth.nick} onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor='email'>Email</label>
            <input type='email' name='email' defaultValue={auth.email} onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor='password'>Contraseña</label>
            <input type='password' name='password' onChange={changed} />
          </div>
          <div className="form-post__inputs">
            <label htmlFor="image" className="form-post__label">Sube tu foto</label>
            <input type="file" name="file0" id='file' className="form-post__image" />
          </div>

          <input type='submit' value="Actualizar" className='btn btn-success' />
        </form>



      </div>
    </>
  )
}
