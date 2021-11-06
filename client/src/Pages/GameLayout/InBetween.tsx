import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { UseStateContext } from "../../store";

const InBetween = () => {
  // const { roomName } = useParams<{ roomName?: string }>();
  const { state } = UseStateContext();
  const { issuedCards, turn, playerStatus, pot, stake, minBuyin } =
    state.gameState!;
  // {playerName, stack, winnings} = playerStatus[]
  //* If player turn, show option, else display waiting...
  //* Show player status on modal
  //* show stake and minBuyin in setting

  //* Game Setup
  return (
    <Container sx={{ height: "100vh" }}>
      <Container
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid black",
        }}
      >
        <Typography component="h1" variant="h6">
          Current Pot Size: {pot}
        </Typography>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>{issuedCards[0]}</Box>
          <Box>{issuedCards[1]}</Box>
        </Container>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Button variant="contained" color="error">
            PASS
          </Button>
          <Settings sx={{ cursor: "pointer" }} />
          <Button variant="contained" color="success">
            HIT
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default InBetween;
