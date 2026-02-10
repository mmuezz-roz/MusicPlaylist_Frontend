import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import  toast  from "react-hot-toast";

function Loginser(){

    const navigate = useNavigate()
    const [message,setMessage]= useState("")
    const [userData,setUserData] = useState({
        
        email:"",
        password:""
    });

    // const HandleLogSubmit = (e)=>{
    //     e.preventDefault();

    //     if(!userData.email || !userData.password){
    //         toast.error("All Field Required")
    //     }
    // }

    const HandleChange = (e)=>{
        setUserData({
            ...userData,[e.target.name]:e.target.value,
        });

    }
    const HandleSubmit = async(e)=>{
        e.preventDefault()
        try {
             if(!userData.email || !userData.password){
            setMessage("All Field Required")
            return;
        }
            const res = await api.post("/login",userData)
            localStorage.setItem("token",res.data.token)
            localStorage.setItem("user",JSON.stringify(res.data.user))
            toast.success("loginn succesfull!!")
            navigate("/Home")

        } catch (error) {
            console.log(error);
            toast.error("Login Failed.. please Try again..")
            
        }
    }

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-500">
            <form onSubmit={HandleSubmit}
             className="w-96 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                

                <input type="text" name="email"
                placeholder="enter Your Email"
                className="w-full p-2 mb-4 border rounded"
                onChange={HandleChange}
                value={userData.email} />

                 <input type="text" name="password" 
                placeholder="enter password" 
                className="w-full p-2 mb-4 border rounded"
                onChange={HandleChange}
                value={userData.password}/>

                <button  type="submit"  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
                  <button
                type="button"
                 onClick={() => navigate("/register")}
                 className="mt-4 w-full text-sm text-blue-600 hover:underline"> New here? Create an account
                    <span className="font-medium ml-2">Sign up</span>
        </button>
                {message &&(
                    <p className="text-red-500 text-center">All Field Required..</p>
                )}
             </form>
        </div>
    )

}

export default Loginser