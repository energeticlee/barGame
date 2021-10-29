import { IUserInfo } from "./Interface";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useHistory } from "react-router-dom";

export const handleCreateRoom = async (
  username: string,
  roomName: string,
  setUsername: React.Dispatch<React.SetStateAction<IUserInfo | undefined>>,
  setMessage: React.Dispatch<React.SetStateAction<string | undefined>>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  const history = useHistory();
  //* Send socket request
  socket.emit("create-room", { roomName, username }, (res: boolean) => {
    if (res) {
      //* Room Successfully Created
      setUsername({ username, roomName });
      history.push("/room"); //* Need params
    } else {
      //* Some other error
      setMessage("Room Taken");
    }
  });
};
