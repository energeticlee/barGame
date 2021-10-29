import React, { useEffect, useState, useRef } from "react";
import { Switch, Route } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import GameLobby from "./Pages/GameLobby";
import HostSetup from "./Pages/HostSetup";
import PlayerSetup from "./Pages/PlayerSetup";
import { IUserInfo } from "./Helper/Interface";

const socket = io(`http://localhost:5000`, { transports: [`websocket`] });
function App() {
  const [userInfo, setUserInfo] = useState<IUserInfo | undefined>();
  // useEffect(() => {
  //   //* Listening for host game change
  //   socket.on("game-change", (selectedGame) => {
  //     setSelectedGame(selectedGame);
  //   });
  // }, []);

  return (
    <div className="App">
      <Switch>
        <Route exact path="" component={GameLobby} />
        <Route path="host-setup" component={HostSetup} />
        <Route exact path="player-setup" component={PlayerSetup} />
      </Switch>
    </div>
  );
}

export default App;
