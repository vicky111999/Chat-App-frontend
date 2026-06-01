"use client";

import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../api/socket";
import { api } from "../../api/axiosIntance";

const Page = () => {
  const [value, setValue] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [users, setUsers] = useState([]);
  const [userdata, setUserdata] = useState({});
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [istying,setIstyping] = useState('')
  const [typing,setTyping] = useState('')
  const bottomRef = useRef(null)
  useEffect(() => {
    socket.connect();
    console.log("connected");
    const handlemsg =(msg)=>{
        setMsgs((prev)=>[...prev, msg]);
    }
    socket.on("newmsg",handlemsg);
    return (()=>{
      socket.off("newmsg",handlemsg)
    })
  }, []);
  useEffect(()=>{
    socket.on('usertyping',()=>{
      setIstyping(`Typing...`)
    })
    socket.on('userstoptyping',()=>{
      setIstyping('')
    })
    return(()=>{
      socket.off('usertyping')
      socket.off('userstoptyping')
    })
  },[])
  // useEffect(()=>{
  //   socket.emit('typing', {receiverid:userdata.id,})
  // },[user.id])
  useEffect(()=>{
    bottomRef.current?.scrollIntoView()
  },[messages,msgs])
  useEffect(() => {
    const fetchusers = async () => {
      try {
        const allusers = await api.get("/auth/getallusers");
        setUsers(allusers.data.message);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchusers();
  }, []);

  const getallmessage = async (id) => {
    const getallmessages = await api.get(`/message/allmessages/${id}`);
    const messages = getallmessages.data.message;
    setMessages(messages);
  };

  useEffect(() => {
    const getuserdata = () => {
      const userdata = JSON.parse(localStorage?.getItem("user"));
      setUser(userdata);
    };
    getuserdata();
  }, []);

  useEffect(() => {
    const defaultuser=()=>{
  if (!users.length || !user?.id) return;
  const firstUser = users[0];
  setUserdata(firstUser);
  socket.emit("joinroom", {
    userid: user.id,
    targetid: firstUser.id,
  });
  getallmessage(firstUser.id);
}
defaultuser()
}, [users, user]);

  const message = {
    senderid: user.id,
    receiverid: userdata.id,
    msg: value,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("chatmessage", message);
    setValue('')
  };
  const connectuser = (res) => {
    setMsgs([])
    setUserdata(res);
    socket.emit("joinroom", { userid: user.id, targetid: res.id });
    console.log(user.id,res.id)
  };
 const time = (curdate)=>{
    return new Date(new Date(curdate).getTime())
  // .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
 }
  return (
    <div className="h-full">
      <h3 className="mx-auto text-2xl font-bold bg-[yellow]/50 p-[10px]">
        REAL TIME CHAT APP
      </h3>
      <div className="h-full flex">
        <div className="flex flex-col gap-[10px] w-full md:w-2/5 border-r-3 border-[grey]/50 p-[5px] h-full mt-[10px]">
          {users ? (
            users?.map((res) => {
              return (
                <div
                  key={res.id}
                  className="bg-[grey]/25 p-[10px] rounded-xl flex items-center cursor-pointer gap-[10px] hover:bg-[grey]/30"
                  onClick={() => {
                    connectuser(res);
                    getallmessage(res.id);
                  }}
                >
                  <p className="size-10 rounded-full bg-[white]"></p>
                  <p className="text-xl font-bold">{res.name}</p>
                </div>
              );
            })
          ) : (
            <p className="text-[black]/20 ">No Users Found</p>
          )}
        </div>
        <div className="w-full md:w-3/5 p-[5px] mt-[10px] h-full bg-[grey]/50">
          <div className="flex flex-col h-full">
            <div className="bg-[green]/25 p-[10px] rounded-xl flex items-center gap-[10px]">
              <p className="size-10 rounded-full bg-[white]"></p>
              <p className="text-xl font-bold">{userdata.name}</p>
            </div>
            <div className="flex-1 overflow-y-scroll my-5">
              {messages?.map((msg) => {
                return (
                  <div key={msg.id} className="flex p-2">
                   
                    <p
                      className={`max-w-fit ${msg.receiverId === userdata.id ? " bg-[blue]/50 p-2 ml-auto rounded-xl text-[white]" : "bg-[white] rounded-xl p-2 mr-auto"} `}
                    >
                      {msg.message} 
                    </p>
                    <p ref={bottomRef}></p>
                    </div>
                 
                );
              })}
              {msgs?.map((cur)=>{
               return <div key={cur.id} className="flex p-2">
              <div className={`max-w-fit ${cur.receiverId === userdata.id ? "bg-[blue]/50 p-2 ml-auto rounded-xl text-[white]" : "bg-[white] rounded-xl p-2 mr-auto"} `}>{cur.message}</div>
            <div ref={bottomRef}></div>
            </div>
              })}
              
            </div>
            <form onSubmit={handleSubmit} className="flex gap-5 w-full">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="p-[15px] bg-[white] border border-[grey]/50 w-4/5 rounded-xl"
                placeholder="Enter a message"
              ></input>
              <button
                type="submit"
                className="bg-[green]/60 hover:bg-[green]/50 cursor-pointer px-[40px] text-[white] font-bold rounded-xl"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
