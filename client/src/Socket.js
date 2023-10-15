import { io } from "socket.io-client"

const URL = process.env.REACT_APP_SOCKET_URL 
console.log("url here", URL);
export const socket = io(URL, {
  autoConnect: false,
  secure: true,
})


socket.io.opts.debug = true;