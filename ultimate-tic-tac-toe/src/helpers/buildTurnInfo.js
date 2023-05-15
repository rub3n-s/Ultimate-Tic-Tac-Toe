const buildTurnInfo = (player) => {
  return (
    <>
      <div className="div-symbol">
        <p>
          Player: <span>{player.name}</span>
        </p>
        <img src={player.symbolPath} className={player.symbol + "-mini"} alt={player.symbol} />
      </div>
    </>
  );
};

export default buildTurnInfo;
