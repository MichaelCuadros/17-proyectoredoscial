import { Global } from "./Global";
//que salga el nombre de la persona en la pagina
export const GetProfile_full = async (userId,setState) => {
    
    const request = await fetch(Global.url + "user/profile/" + userId, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        }
    })
    const data = await request.json();

    if(data.status=="success"){
    setState(data.user);
}
}
