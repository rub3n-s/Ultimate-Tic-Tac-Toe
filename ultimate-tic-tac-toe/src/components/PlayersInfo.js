import './PlayersInfo.css';

const PlayersInfo = ({ player1Info, player2Info, turnInfo, timeLeft }) => {
  return (
    <div className="playersInfo">
      <div className="container">
        <p className="title">Tables Completed</p>
        {player1Info != null && player2Info != null && (
          <>
            <p>
              {player1Info.name}: {player1Info.points}
            </p>
            <p>
              {player2Info.name}: {player2Info.points}
            </p>
          </>
        )}
      </div>
      <div className="container">
        <p className="title">Turn</p>
        {turnInfo != null && turnInfo}
      </div>
      <div className="container">
        <p className="title">Rounds Won</p>
        {player1Info != null && player2Info != null && (
          <>
            <p>
              {player1Info.name}: {player1Info.roundsWon}
            </p>
            <p>
              {player2Info.name}: {player2Info.roundsWon}
            </p>
          </>
        )}
      </div>
      <div className="container">
        <p className="title">Timer</p>
        <p>{timeLeft}</p>
      </div>
    </div>
  );
};

export default PlayersInfo;