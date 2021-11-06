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

    socket.on("update-lobby-buyin", (data: IUserInfo[]) =>
      useDisPlayerStatus(data)
    );

    socket.emit("get-players", roomName, (res: ICallBack) => {
      if (res.status) useDisPlayerStatus(res.data);
      else useDisMessage(res.msg!);
    });

    socket.on("start-game", ({ game, roomName }) =>
      histroy.push(`/room/${game}/${roomName}`)
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
