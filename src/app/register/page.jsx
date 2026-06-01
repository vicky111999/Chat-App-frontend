"use client";
import React, { useState } from "react";
import { api } from "../../../api/axiosIntance";
import Link from "next/link";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error,setError] = useState({})

  const handleChange = (e) => {
    setFormData({
      ...formData,
    [e.target.name] : e.target.value
    })
    setError({})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newerror = {}
    
    if(!formData?.name) newerror.name ="Please enter a name"
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
     return setError(newerror)
    }
    try {
      await api.post("/auth/register", formData);
      alert("successfully Registered");
    } catch (err) {
      console.log(err.message);
    }
  };
  console.log(error)
  return (
    <div className="h-full flex items-center justify-center bg-[grey]/25">
    <form onSubmit={handleSubmit} className="flex flex-col bg-[white]/50 p-[30px] gap-[20px] rounded-xl">
    <h3 className="mx-auto text-2xl font-bold uppercase">Register</h3>
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="Enter Name*"
        value={formData.name}
        name="name"
        onChange={handleChange}
        className="p-[10px] bg-[yellow]/20 border border-[grey]/20 rounded-xl"
      ></input>
      {error.name && <p className="text-xs text-[red]">{error.name}</p>}
      </div>
      <div className="flex flex-col">
      <input
        type="email"
        placeholder="Enter Email*"
        value={formData.email}
        name="email"
        onChange={handleChange}
        className="p-[10px] bg-[yellow]/20 border border-[grey]/20 rounded-xl"
      ></input>
      {error.email && <p className="text-xs text-[red]">{error.email}</p>}
      </div>
      <div className="flex flex-col">
      <input
        type="password"
        placeholder="Enter password*"
        value={formData.password}
        name="password"
        onChange={handleChange}
        className="p-[10px] bg-[yellow]/20 border border-[grey]/20 rounded-xl"
      ></input>
      {error.password && <p className="text-xs text-[red]">{error.password}</p>}
      </div>
      <button type="submit" className="bg-[green]/80 rounded-xl p-[5px] text-[white] cursor-pointer">Register</button>
      <p>If you already have an account? <Link href='/login' className="text-[blue] cursor-pointer hover:underline underline-offset-2">Login</Link></p>
    </form>
    </div>
  );
};

export default Page;
