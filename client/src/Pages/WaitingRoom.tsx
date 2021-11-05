import { useParams } from "react-router-dom";
import { useWaitRoomSocket, useHandleReady } from "../Helper/customHooks";
import { UseStateContext } from "../store";
import { IAvailableGame } from "../Helper/Interface";
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

const WaitingRoom = () => {
  const { state, isHost } = UseStateContext();
  const { socket, playerStatus, gameInfo, message, availableGames, userData } =
    state;
  const { roomName } = useParams<{ roomName?: string }>();
  const { selectedGame } = gameInfo!;

  useWaitRoomSocket(roomName!, userData?.username!);

  const allPlayerReady = () =>
    Object.values(playerStatus!).filter(
      (playerState) => playerState.readyState === false
    ).length === 0;

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
            <Typography component="h1" variant="h5">
              {selectedGame && `${selectedGame} : $0.50 Ante`}
            </Typography>
          )}
          <WaitingTable playerStatus={playerStatus!} />
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
