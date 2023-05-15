const buildTurnInfo = (player) => {
  return (
    <>
      <p>Player: <span>{player.name}</span></p>
      <div className="div-symbol ">
        <p>Symbol: </p>
        <img src={player.symbolPath} className={player.symbol + "-mini"} alt={player.symbol}></img>
      </div>
    </>
  );
};

export default buildTurnInfo;
