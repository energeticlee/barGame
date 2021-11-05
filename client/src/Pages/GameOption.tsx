import { useParams, useHistory } from "react-router-dom";
import InBetween from "./GameLayout/InBetween";

const GameOption = () => {
  const { gameName } = useParams<{ gameName?: string }>();
  const history = useHistory();

  const GameRoom = (game: string) => {
    switch (game) {
      case "inbetween":
        return <InBetween />;

      default:
        history.push("/");
        break;
    }
  };

  return <div className="App">{GameRoom(gameName!)}</div>;
};

export default GameOption;
