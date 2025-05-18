import axios from "axios"


const api= axios.create({
    baseURL:"http://127.0.0.1:8000"
});



api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config
});

api.interceptors.response.use( (response)=>response,
(error)=>{

    if(error.response?.status==403){
        console.log("Token expired .Redirecting to login ...");
        localStorage.removeItem("token");
        alert("Looks like your session timed out. Please log in again.")
        window.location.href="/auth"
    }
    return Promise.reject(error)
});





export default api;