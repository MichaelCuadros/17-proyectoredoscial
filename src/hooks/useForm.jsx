import React, { useState } from 'react'

export const useForm = (initialObj={}) => {
    const [form,setForm]=useState(initialObj);

    const changed=({target})=>{
        const {name,value}=target;

        setForm({
            ...form,//el contenido que ya tiene form
            [name]:value //agregando nuevos valores dentro de mi formulario
        })
       // console.log(form)
    }

  return {
    form,
    changed
  }
}
