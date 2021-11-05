import React from "react";
import { useParams } from "react-router-dom";

const InBetween = () => {
  const { roomName } = useParams<{ roomName?: string }>();

  //* Game Setup
  return <div>{roomName}</div>;
};

export default InBetween;
