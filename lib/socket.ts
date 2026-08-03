import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  const token = Cookies.get("token") || "";

  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
      {
        auth: {
          token: token,
        },
        extraHeaders: {
          Authorization: `Bearer ${token}`, 
        },
        autoConnect: false,
      },
    );
  } else {
    socket.auth = { token };
  }

  return socket;
};

export const connectSocket = (): Socket => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
