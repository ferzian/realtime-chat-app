import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = Cookies.get("token");

    socket = io(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", {
      auth: {
        token: token,
      },
      autoConnect: false,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
