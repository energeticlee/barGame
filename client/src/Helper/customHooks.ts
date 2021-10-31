import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IUserInfo } from "./Interface";
import { UseStateContext } from "../store";

const {
  state,
  useDisMessage,
  useClearMessage,
  useDisPlayerStatus,
  useDisAvailableGames,
} = UseStateContext();
const { socket, userData, roomInfo } = state;
const history = useHistory();

//* DIRECTORY
//? useFetchGames
//? useWaitRoomSocket
//? useHandleReady
//? useCreateRoom

export const useFetchGames = () => {
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

export const useCreateRoom = async () => {
  //* Send socket request
  if (roomInfo) {
    socket.emit(
      "create-room",
      userData,
      (res: { status: boolean; msg: string; data: IUserInfo[] }) => {
        if (res.status) {
          //* Room Successfully Created
          useDisPlayerStatus(res.data);
          history.push(`/room/${roomInfo.roomName}`);
        } else {
          //* Some other error
          useDisMessage(res.msg);
          useClearMessage(2000);
        }
      }
    );
  }
};
