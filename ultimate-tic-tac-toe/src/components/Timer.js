import { useEffect, useState } from "react";

const Timer = ({ levelTimeOut }) => {
  const [gameEnded, setGameEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (levelTimeOut === 0) {
        setGameEnded(true);
      } else {
        setTimeLeft(--levelTimeOut + "s");
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [levelTimeOut]);
  return !gameEnded ? timeLeft : 0;
};

export default Timer;
