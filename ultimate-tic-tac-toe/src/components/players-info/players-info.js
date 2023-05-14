import "./players-info.css";

const PlayersInfo = ({ player1Info, player2Info, turnInfo }) => {
  return (
    <div className="playersInfo">
      <div className="container">
        {player1Info != null && player2Info != null && (
          <>
            <p className="title">{player1Info.name}</p>
            <p>Won Tables: {player1Info.points}</p>
            <p>Won Rounds: {player1Info.roundsWon}</p>
            <p>Time Left: <span id="player1-timer">{player1Info.timeLeft}s</span></p>

            <p className="title">{player2Info.name}</p>
            <p>Won Tables: {player2Info.points}</p>
            <p>Won Rounds: {player2Info.roundsWon}</p>
            <p>Time Left: <span id="player2-timer">{player2Info.timeLeft}s</span></p>
          </>
        )}
      </div>
      <div className="container">
        <p className="title">Turn</p>
        {turnInfo != null && turnInfo}
      </div>
    </div>
  );
};

export default PlayersInfo;
