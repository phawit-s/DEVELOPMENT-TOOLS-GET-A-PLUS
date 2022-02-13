import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { io } from "socket.io-client";
import { useEffect, useRef } from 'react';
import { useSelector } from "react-redux";

export default function Chats() {

  const messageend = useRef('');
  const [msg, setmsg] = React.useState('');
  const [textArr, settextArr] = React.useState([]);
  const [socketIO, setsocketIO] = React.useState('');
  const getUsrname = useSelector((state) => state.usrname.username);

  useEffect(function socketConnect() {
    const socket = io('https://wannaplay-world-chat.herokuapp.com/world_chat');
    setsocketIO(socket);
    return () => socket.close();
  }, [setsocketIO]);

  useEffect(() => {
    if (!socketIO) return;
    joinHandle()
    socketIO.on('message', (data) => {
      settextArr(prev => [...prev, data.message]);
      
    });
    socketIO.on('has-join-message', (data) => settextArr(prev => [...prev, { message: data.message, time: data.time, socketId: data.socketId }]));
    socketIO.on('client-boardcast', (data) => settextArr(prev => [...prev, { username: data.username, message: data.message, time: data.time, socketId: data.socketId }]));
  }, [socketIO]);


  const sroll = () => {
    messageend.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(sroll, [textArr])

  const msgHandle = function (e) {
    setmsg(e.target.value);
  }

  const joinHandle = () => {

    const date = new Date();
    socketIO.emit('join', { username: getUsrname, socketId: socketIO.id, time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  }

  const sendHandle = () => {
    if (msg.length != 0 && !hasBlankSpaces(msg)) {
      const date = new Date();
      socketIO.emit('client-send', { username: getUsrname, message: msg, socketId: socketIO.id, time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      setmsg("")
    }
    else {
      alert("กรุณาใส่ข้อความ")
      setmsg("")
    }
  }

  var handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (msg.length != 0 && !hasBlankSpaces(msg)) {
        const date = new Date();
        socketIO.emit('client-send', { username: getUsrname, message: msg, socketId: socketIO.id, time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        setmsg("")
      }
      else {
        alert("กรุณาใส่ข้อความ")
        setmsg("")
      }
    }
  }

  function hasBlankSpaces(str) {
    return str.match(/^\s+$/) !== null;
  }

  return (
    <Box
      sx={{
        bgcolor: '#1C2128',
        display: 'flex',
        justifyContent: 'center',
        color: '#ffffff',
        height: '100%',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          bgcolor: '#22272E',
          width: '100%',
          flexDirection: 'column',
          p: 5,
        }}
      >
        <Box id='allchats' sx={{ overflowY: 'scroll', height: "95vh" }}>
          {textArr ? textArr.map((messages, index) => {
            return (
              <Box  sx={{ mb: 5, flexDirection: 'row', display: 'flex' }} key={index} style={socketIO.id == messages.socketId ? { color: '#08e8de' } : { color: '#ffffff' }}>
                <Box sx={{ mr: 5 }}>
                  {messages.time}
                </Box>

                <Box sx={{
                  flexDirection: 'column', display: 'flex'
                }}>
                  <Box sx={{ mb: 1, fontWeight: 'bold' }}>{messages.username}</Box>
                  <Box>{messages.message}</Box>
                </Box>
                
              </Box>

            )
          }) : "loading..."
          }
          <div ref={messageend} />
        </Box>


        <TextField

          placeholder="Message"
          value={msg}
          onChange={msgHandle}
          sx={{
            width: '100%',
            bgcolor: '#2C333C',
            borderRadius: 2,
            color: '#ffffff',
            input: { color: '#ffffff' },
          }}
          id="input-with-icon-textfield"
          onKeyPress={handleKeyPress}
          InputProps={{
            endAdornment: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                onClick={sendHandle}
              >
                <path d="M10.27 20.7676L9.37555 20.3204L10.27 20.7676ZM8.41978 20.6145L9.37555 20.3204L8.41978 20.6145ZM14.0673 13.6202L13.6201 12.7257L14.0673 13.6202ZM13.6201 14.0674L14.5145 14.5146L13.6201 14.0674ZM20.6144 8.41984L20.3203 9.37562L20.6144 8.41984ZM20.7675 10.27L21.2148 11.1645L20.7675 10.27ZM4.8053 3.55549L4.51121 4.51127L4.8053 3.55549ZM3.55543 4.80536L4.51121 4.51127L3.55543 4.80536ZM4.51121 4.51127L20.3203 9.37562L20.9085 7.46406L5.09938 2.59971L4.51121 4.51127ZM20.3203 9.37562L13.6201 12.7257L14.5145 14.5146L21.2148 11.1645L20.3203 9.37562ZM12.7257 13.6202L9.37555 20.3204L11.1644 21.2148L14.5145 14.5146L12.7257 13.6202ZM9.37555 20.3204L4.51121 4.51127L2.59965 5.09944L7.464 20.9086L9.37555 20.3204ZM9.37555 20.3204H9.37555L7.464 20.9086C7.99462 22.6331 10.3575 22.8286 11.1644 21.2148L9.37555 20.3204ZM13.6201 12.7257C13.233 12.9193 12.9192 13.2331 12.7257 13.6202L14.5145 14.5146V14.5146L13.6201 12.7257ZM20.3203 9.37562L20.3203 9.37562L21.2148 11.1645C22.8286 10.3576 22.633 7.99468 20.9085 7.46406L20.3203 9.37562ZM5.09938 2.59971C3.56483 2.12755 2.12748 3.56489 2.59965 5.09944L4.51121 4.51127L4.51121 4.51127L5.09938 2.59971Z" fill="white" />
              </svg>

            ),
          }}

        >

        </TextField>

      </Container>

    </Box>

  )
}
