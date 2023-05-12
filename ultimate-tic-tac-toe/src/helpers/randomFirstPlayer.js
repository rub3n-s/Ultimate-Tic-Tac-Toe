const randomFirstPlayer = (player1Struct, player2Struct) => {
  // Get a random player for the first play
  return Math.random() < 0.5 ? player1Struct : player2Struct;
};

export default randomFirstPlayer;