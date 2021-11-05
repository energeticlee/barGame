import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IUserInfo, ICallBack, IGameInfo } from "./Interface";
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
    useDisGameInfo,
    updateHost,
  } = UseStateContext();
  const { socket } = state;
  const histroy = useHistory();

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

    socket.on("update-game", (data: IGameInfo) => useDisGameInfo(data));

    socket.emit("get-players", roomName, (res: ICallBack) => {
      if (res.status) useDisPlayerStatus(res.data);
      else useDisMessage(res.msg!);
    });

    socket.on("start-game", (roomName) =>
      histroy.push(`/room/inbetween/${roomName}`)
    );

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
  const { socket, userData, roomInfo, gameInfo } = state;
  const { selectedGame } = gameInfo!;

  //* Userdata validation
  if (roomInfo) {
    //* Send socket request
    socket.emit(
      "initialise-game",
      userData,
      roomName,
      selectedGame,
      (res: ICallBack) => {
        if (!res.status) useDisMessage(res.msg);
      }
    );
  }
};
