import React, { useEffect, useState, useRef, createContext } from "react";
import { Switch, Route } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import GameLobby from "./Pages/GameLobby";
import HostSetup from "./Pages/HostSetup";
import PlayerSetup from "./Pages/PlayerSetup";
import { IUserInfo, IAppContext } from "./Helper/Interface";

export const ContextPackage = createContext<IAppContext | null>(null);
const socket = io(`http://localhost:5000`, { transports: [`websocket`] });
const ContextData: IAppContext = {
  socket,
};

function App() {
  const [userInfo, setUserInfo] = useState<IUserInfo | undefined>();
  // useEffect(() => {
  //   //* Listening for host game change
  //   socket.on("game-change", (selectedGame) => {
  //     setSelectedGame(selectedGame);
  //   });
  // }, []);

  return (
    <ContextPackage.Provider value={ContextData}>
      <div className="App">
        <Switch>
          <Route exact path="/" component={GameLobby} />
          <Route path="/host-setup" component={HostSetup} />
          <Route path="/player-setup" component={PlayerSetup} />
          <Route path="/room/:roomName" />
        </Switch>
      </div>
    </ContextPackage.Provider>
  );
}

export default App;
