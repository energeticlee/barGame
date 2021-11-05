import { Switch, Route } from "react-router-dom";
import "./App.css";
import Menu from "./Pages/Menu";
import HostSetup from "./Pages/HostSetup";
import PlayerSetup from "./Pages/PlayerSetup";
import { ContextProvider } from "./store";
import WaitingRoom from "./Pages/WaitingRoom";
import GameOption from "./Pages/GameOption";

function App() {
  //* Menu & Game Page
  return (
    <ContextProvider>
      <div className="App">
        <Switch>
          <Route path="/host-setup" component={HostSetup} />
          <Route path="/player-setup" component={PlayerSetup} />
          <Route path="/lobby/:roomName" component={WaitingRoom} />
          <Route path="/room/:gameName/:roomName" component={GameOption} />
          <Route path="/" component={Menu} />
        </Switch>
      </div>
    </ContextProvider>
  );
}

export default App;
