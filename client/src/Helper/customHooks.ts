import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IUserInfo, ICallBack } from "./Interface";
import { UseStateContext } from "../store";

//* DIRECTORY
//? useWaitRoomSocket
//? useHandleReady

export const useWaitRoomSocket = (roomName: string, username: string) => {
  const {
    useDisMessage,
    useDisAvailableGames,
    state,
    useDisPlayerStatus,
    useDisSelectedGame,
    updateHost,
  } = UseStateContext();
  const { socket } = state;

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch("http://localhost:5050/api/games/all-games", {
        mode: "cors",
      });
      const { data, msg } = await res.json();
      if (res.ok) useDisAvailableGames(data);
      else useDisMessage(msg);
    };
    fetchGames();

    socket.on("new-join", (data: IUserInfo[]) => useDisPlayerStatus(data));

    socket.on("update-player-status", (data: IUserInfo[]) =>
      useDisPlayerStatus(data)
    );

    socket.on("update-game", (data: string) => useDisSelectedGame(data));

    socket.emit("get-players", roomName, (res: ICallBack) => {
      if (res.status) useDisPlayerStatus(res.data);
      else useDisMessage(res.msg!);
    });

    socket.emit("is-host", { roomName, username }, (res: ICallBack) => {
      if (res.status) updateHost(res.isHost);
      else {
        updateHost(res.isHost);
        useDisMessage(res.msg!);
      }
    });
  }, []);
};

export const useHandleReady = async (roomName: string) => {
  const { state, useDisMessage } = UseStateContext();
  const { socket, userData, roomInfo } = state;

  //* Userdata validation
  if (roomInfo) {
    //* Send socket request
    socket.emit("set-ready", userData, roomName, (res: ICallBack) => {
      if (!res.status) useDisMessage(res.msg);
    });
  }
};
