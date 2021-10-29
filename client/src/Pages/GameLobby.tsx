import React from "react";
import { Link } from "react-router-dom";
import RouteButton from "../Components/RouteButton";

interface Props {}

const GameLobby = (props: Props) => {
  return (
    <div>
      <RouteButton text="Create Room" routeTo="/host-setup" />
      <RouteButton text="Join Room" routeTo="/player-setup" />
    </div>
  );
};

export default GameLobby;
