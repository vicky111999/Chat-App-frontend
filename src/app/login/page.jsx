"use client";
import React, { useState } from "react";
import { api } from "../../../api/axiosIntance";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
    const [error,setError] = useState({})
  
  const router = useRouter();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError({
      [e.target.name] : ''
    })
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newerror = {}
    
    if(!formData?.email) newerror.email = 'Please enter a email'
    if(!formData?.password) newerror.password = "Please enter a password"
    if(formData?.password){
       if (!/[A-Z]/.test(formData?.password)) newerror.password = 'Must include atleast one uppercse'
    if (!/[a-z]/.test(formData?.password)) newerror.password = 'Must include atleast one lowercase'
    if (!/\d/.test(formData?.password)) newerror.password = 'Must include atleast one number'
    if (!/[^A-Za-z0-9]/.test(formData?.password)) newerror.password = 'Must include atlesat one special characters'
    if (formData?.password.length < 8) newerror.password = 'Password atleast 8 characters'
    }
    if(formData?.email){
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData?.email)) newerror.email = 'Please enter a valid email'
    }
   
    if(Object.keys(newerror).length > 0){
      console.log(newerror)
     return setError(newerror)
    }
    try {
      const user = await api.post("/auth/login", formData);
      localStorage.setItem("token",user.data.message.token);
      localStorage.setItem("user",JSON.stringify({id:user.data.message.id}));
      router.push("/");
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="h-full bg-[grey]/25 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[white]/50 flex flex-col p-[30px] rounded-xl gap-[20px]"
      >
        <h3 className="text-2xl font-bold mx-auto uppercase">Login</h3>
         <div className="flex flex-col">
        <input
          type="text"
          name="email"
          placeholder="Enter email*"
          value={formData.email}
          onChange={handleChange}
          className="bg-[yellow]/20 border border-[grey]/20 p-[10px] rounded-xl"
        ></input>
        {error.email && <p className="text-xs text-[red]">{error.email}</p>}
        </div>
        <div className="flex flex-col">
        <input
          type="password"
          name="password"
          placeholder="Enter password*"
          value={formData.password}
          onChange={handleChange}
          className="bg-[yellow]/20 border border-[grey]/20 p-[10px] rounded-xl"
        ></input>
        {error.password && <p className="text-xs text-[red]">{error.password}</p>}
        </div>
        <button
          type="submit"
          className="bg-[green]/80 p-[5px] text-[white] rounded-xl cursor-pointer"
        >
          Login
        </button>
        <p>
          If you dont have an account?
          <Link
            href="/register"
            className="text-[blue] cursor-pointer hover:underline underline-offset-2"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Page;
