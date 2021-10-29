import react, { useEffect } from "react";

export const clearMessage = (
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  timer: number
) => {
  setTimeout(() => setMessage(""), timer);
};
