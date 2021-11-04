import { useParams } from "react-router-dom";
import { useWaitRoomSocket, useHandleReady } from "../Helper/customHooks";
import { UseStateContext } from "../store";
import { IAvailableGame } from "../Helper/Interface";
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
  const {
    socket,
    playerStatus,
    selectedGame,
    message,
    availableGames,
    userData,
  } = state;
  const { roomName } = useParams<{ roomName?: string }>();

  useWaitRoomSocket(roomName!, userData?.username!);

  const allPlayerReady = () =>
    Object.values(playerStatus!).filter(
      (playerState) => playerState.readyState === false
    ).length === 0;

  //* Listen for READY (Update backend game state)
  //* if all player ready, startGame enabled
  //* initialise game
  //* route to game board
  const handleChangeGame = (e: SelectChangeEvent<string>) => {
    socket.emit("change-game", { data: e.target.value, roomName });
  };

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
          sx={{ height: 10, mt: 2 }}
          component="h1"
          variant="subtitle1"
        >
          {message && message}
        </Typography>
        <Box
          component="form"
          sx={{
            mt: 4,
          }}
        >
          {isHost ? (
            <>
              <InputLabel id="selectGame">Select Game</InputLabel>
              <Select
                labelId="selectGame"
                required
                fullWidth
                id="selectGame"
                value={selectedGame ? selectedGame : ""}
                onChange={(e) => handleChangeGame(e)}
                sx={{ mb: 2, textAlign: "left" }}
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
            </>
          ) : (
            <Typography component="h1" variant="h5">
              {selectedGame}
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
              CREATE!
            </Button>
          )}
        </Box>
      </Container>
    </>
  );
};

export default WaitingRoom;
