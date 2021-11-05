import { FC } from "react";
import { TextField, Container, SelectChangeEvent } from "@mui/material";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io-client";

interface Props {
  handleChangeGame: (
    e:
      | SelectChangeEvent<string | number>
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => Socket<DefaultEventsMap, DefaultEventsMap>;
}

const Stake: FC<Props> = ({ handleChangeGame }) => {
  return (
    <Container
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <TextField
        margin="normal"
        required
        sx={{ width: 2 / 5, mr: 1 }}
        id="stake"
        label="Stake ($)"
        type="number"
        name="stake"
        autoFocus
        onChange={(e) => handleChangeGame(e)}
      />
      <TextField
        margin="normal"
        required
        sx={{ width: 2 / 5, ml: 1 }}
        id="minBuyin"
        type="number"
        label="Min Buyin"
        name="minBuyin"
        autoFocus
        onChange={(e) => handleChangeGame(e)}
      />
    </Container>
  );
};

export default Stake;
