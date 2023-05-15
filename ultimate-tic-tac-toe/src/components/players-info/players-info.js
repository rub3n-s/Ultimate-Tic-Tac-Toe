import "./players-info.css";

const PlayersInfo = ({ player1Info, player2Info, turnInfo, timeLeft }) => {
  return (
    <div className="playersInfo">
      <div className="container">
        <p className="title">Turn</p>
        {turnInfo != null && turnInfo}
        <p>
          Time Left: <span id="player-timer">{timeLeft}</span>
        </p>
      </div>
      <div className="container">
        {player1Info != null && player2Info != null && (
          <>
            <p className="title">{player1Info.name}</p>
            <p>Won Tables: <span>{player1Info.points}</span></p>
            <p>Won Rounds: <span>{player1Info.roundsWon}</span></p>
            {/* <p>
              Time Left: <span id="player1-timer">{player1Info.timeLeft}s</span>
            </p> */}

            <p className="title">{player2Info.name}</p>
            <p>Won Tables: <span>{player2Info.points}</span></p>
            <p>Won Rounds: <span> {player2Info.roundsWon}</span></p>
            {/* <p>
              Time Left: <span id="player2-timer">{player2Info.timeLeft}s</span>
            </p> */}
          </>
        )}
      </div>
    </div>
  );
};

export default PlayersInfo;
