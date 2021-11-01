import { useParams } from "react-router-dom";
import {
  useFetchGames,
  useHandleReady,
  useWaitRoomSocket,
  allPlayerReady,
  useGetPlayers,
} from "../Helper/customHooks";
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
} from "@mui/material";
import WaitingTable from "../Components/WaitingTable";

const WaitingRoom = () => {
  const { state, useDisSelectedGame, isHostState } = UseStateContext();
  const { playerStatus, selectedGame, message, availableGames } = state;
  const { roomName } = useParams<{ roomName?: string }>();

  const [isHost, setIsHost] = isHostState();

  useFetchGames();
  useGetPlayers(roomName!);
  useWaitRoomSocket();

  //* Listen for READY (Update backend game state)
  //* if all player ready, startGame enabled
  //* initialise game
  //* route to game board

  return (
    <>
      <CssBaseline />
      <Container>
        {message && (
          <Typography component="h1" variant="h5">
            {message}
          </Typography>
        )}
        <Box
          component="form"
          sx={{
            mt: 8,
          }}
        >
          <Typography component="h1" variant="h5">
            Create A Room
          </Typography>
          <InputLabel id="selectGame">Select Game</InputLabel>
          <Select
            labelId="selectGame"
            required
            fullWidth
            id="selectGame"
            value={selectedGame ? selectedGame : ""}
            onChange={(e) => useDisSelectedGame(e.target.value)}
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
