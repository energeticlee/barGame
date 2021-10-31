import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IUserInfo } from "./Interface";
import { UseStateContext } from "../store";

//* DIRECTORY
//? useFetchGames
//? useWaitRoomSocket
//? useHandleReady

export const useFetchGames = () => {
  const { useDisMessage, useClearMessage, useDisAvailableGames } =
    UseStateContext();

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch("http://localhost:5050/api/games/all-games", {
        mode: "cors",
      });
      const { data, msg } = await res.json();
      if (res.ok) {
        //* Fetch Successful
        useDisAvailableGames(data);
      } else {
        //* Error
        useDisMessage(msg);
        useClearMessage(2000);
      }
    };
    fetchGames();
  }, []);
};

export const useWaitRoomSocket = () => {
  const { state, useDisPlayerStatus } = UseStateContext();
  const { socket } = state;

  useEffect(() => {
    socket.on("new-join", (data: IUserInfo[]) => {
      useDisPlayerStatus(data);
    });

    socket.on("player-status", (data: IUserInfo[]) => {
      useDisPlayerStatus(data);
    });
  }, []); //* Dependencies [] or null?
};

export const useHandleReady = async (roomName: string) => {
  const { state, useDisMessage, useClearMessage } = UseStateContext();
  const { socket, userData, roomInfo } = state;

  //* Userdata validation
  if (roomInfo) {
    //* Send socket request
    socket.emit(
      "set-ready",
      userData,
      roomName,
      (res: { status: boolean; msg: string }) => {
        if (res.status) {
          //* Set Ready Successful
        } else {
          //* Error
          useDisMessage(res.msg);
          useClearMessage(2000);
        }
      }
    );
  }
};
