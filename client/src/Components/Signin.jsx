import React from "react";
export const Signin=()=>{
    return (
        <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-96 ">
        <h1 className="font-bold text-3xl flex justify-center mb-4">Login</h1>
        <h4 className="flex justify-center text-base">Enter information to login</h4>
        
        <div className="mt-4 ">
          <p>Username</p>
          <input type="text" placeholder="john@example.com" className="border border-black rounded-md p-2 w-full mt-2" />
        </div>
        <div className="mt-4 ">
          <p>Password</p>
          <input type="Password" placeholder="password" className="border border-black rounded-md p-2 w-full mt-2" />
        </div>
        <div className="mt-4 ">
          <button className="w-full bg-black text-white p-3 rounded-md">Login</button>
        </div>
        <div className="mt-4 ">
          <p className="flex justify-center text-1xl">Don't have and account? Signup</p>
        </div>

      </div>

    </div>
    )
}