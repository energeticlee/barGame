import { Switch, Route } from "react-router-dom";
import "./App.css";
import GameLobby from "./Pages/GameLobby";
import HostSetup from "./Pages/HostSetup";
import PlayerSetup from "./Pages/PlayerSetup";
import { ContextProvider } from "./store";
import WaitingRoom from "./Pages/WaitingRoom";

function App() {
  // useEffect(() => {
  //   //* Listening for host game change
  //   socket.on("game-change", (selectedGame) => {
  //     setSelectedGame(selectedGame);
  //   });
  // }, []);

  return (
    <ContextProvider>
      <div className="App">
        <Switch>
          <Route exact path="/" component={GameLobby} />
          <Route path="/host-setup" component={HostSetup} />
          <Route path="/player-setup" component={PlayerSetup} />
          <Route path="/room/:roomName" component={WaitingRoom} />
        </Switch>
      </div>
    </ContextProvider>
  );
}

export default App;
