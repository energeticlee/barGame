import { useParams } from "react-router-dom";
import { useWaitRoomSocket } from "../Helper/customHooks";
import { UseStateContext } from "../store";
import { IAvailableGame, ICallBack } from "../Helper/Interface";
import Stake from "../Components/Stake";
import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import WaitingTable from "../Components/WaitingTable";
import ReqTable from "../Components/ReqTable";

const WaitingRoom = () => {
  const { state, isHost, useDisMessage } = UseStateContext();
  const {
    socket,
    playerStatus,
    gameInfo,
    roomInfo,
    message,
    availableGames,
    userData,
  } = state;
  const { roomName } = useParams<{ roomName?: string }>();
  const { selectedGame, stake, minBuyin } = gameInfo!;
  const { username, userId } = userData!;

  useWaitRoomSocket(roomName!, username!, userId!);

  const allPlayerReady = () =>
    Object.values(playerStatus!).filter(
      (playerState) => playerState.readyState === false
    ).length === 0;

  const useHandleReady = (roomName: string) => {
    if (roomInfo) {
      //* Send socket request
      socket.emit("initialise-game", userData, roomName, (res: ICallBack) => {
        if (!res.status) useDisMessage(res.msg);
      });
    }
  };

  //* Listen for READY (Update backend game state)
  //* if all player ready, startGame enabled
  //* initialise game
  //* route to game board
  //* require min 2 players to start

  const handleChangeGame = (
    e:
      | SelectChangeEvent<string | number>
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    socket.emit("change-setting", {
      gInfo: { [e.target.name]: e.target.value },
      roomName,
      userId,
    });

  return (
    <>
      <CssBaseline />
      <Container>
        <Box
          sx={{
            mt: 2,
            borderBottom: "1px solid",
          }}
        >
          <Typography sx={{ mb: 2 }} component="h1" variant="h5">
            {roomName}
          </Typography>
        </Box>
        <Typography
          sx={{ height: 5, margin: 2, fontSize: "h5" }}
          component="h1"
          variant="subtitle1"
        >
          {message && message}
        </Typography>
        <Box
          component="form"
          sx={{
            mt: 2,
          }}
        >
          {isHost ? (
            <>
              <InputLabel id="selectGameLabel">Select Game</InputLabel>
              <Select
                labelId="selectedGame"
                required
                id="selectedGame"
                name="selectedGame"
                value={selectedGame ? selectedGame : ""}
                onChange={(e) => handleChangeGame(e)}
                sx={{ textAlign: "left", width: 4 / 5 }}
              >
                {availableGames &&
                  availableGames.map(({ gameName }: IAvailableGame, id) => {
                    return (
                      <MenuItem key={id} value={gameName}>
                        {gameName}
                      </MenuItem>
                    );
                  })}
              </Select>
              {selectedGame && <Stake handleChangeGame={handleChangeGame} />}
            </>
          ) : (
            <Container sx={{ display: "flex", justifyContent: "flex-start" }}>
              {selectedGame && (
                <Typography component="h1" variant="h6" sx={{ mr: 2 }}>
                  {`Game: ${selectedGame}`}
                </Typography>
              )}
              {stake && (
                <Typography component="h1" variant="h6" sx={{ ml: 2 }}>
                  {`Ante: $${stake}`}
                </Typography>
              )}
            </Container>
          )}
          <WaitingTable playerStatus={playerStatus!} minBuyin={minBuyin} />
          {isHost && <ReqTable />}
          {isHost && (
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!allPlayerReady()}
              onClick={() => useHandleReady(roomName!)}
            >
              Start Game
            </Button>
          )}
        </Box>
      </Container>
    </>
  );
};

export default WaitingRoom;
