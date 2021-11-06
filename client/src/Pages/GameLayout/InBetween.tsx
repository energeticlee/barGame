import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";

const InBetween = () => {
  const { roomName } = useParams<{ roomName?: string }>();

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
          Current Pot Size:
        </Typography>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>CARD 1</Box>
          <Box>CARD 2</Box>
        </Container>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Button variant="contained">PASS</Button>
          <Box>ICON</Box>
          <Button variant="contained">HIT</Button>
        </Container>
      </Container>
    </Container>
  );
};

export default InBetween;
