import React from "react";
import "./players-info.css";

const PlayersInfo = ({ player1Info, player2Info, turnInfo, playerTimer, timeLeft }) => {
  return (
    <div className="playersInfo">
      <div className="container">
        <p className="title">Turn</p>
        {turnInfo != null && (
          <>
            <div className="div-symbol">
              <p>
                Player: <span>{turnInfo.name}</span>
              </p>
              <img src={turnInfo.symbolPath} className={turnInfo.symbol + "-mini"} alt={turnInfo.symbol} />
            </div>
          </>
        )}
        <p>
          Time Left: <span ref={playerTimer}>{timeLeft}</span>
        </p>
      </div>
      <div className="container">
        {player1Info != null && (
          <>
            <div className="div-symbol">
              <p className="title">{player1Info.name}</p>{" "}
              <img src={player1Info.symbolPath} className={player1Info.symbol + "-mini"} alt={player1Info.symbol} />
            </div>
            <p>
              Won Tables: <span>{player1Info.points}</span>
            </p>
            <p>
              Won Rounds: <span>{player1Info.roundsWon}</span>
            </p>
          </>
        )}
      </div>

      <div className="container">
        {player2Info != null && (
          <>
            <div className="div-symbol">
              <p className="title">{player2Info.name}</p>{" "}
              <img src={player2Info.symbolPath} className={player2Info.symbol + "-mini"} alt={player2Info.symbol} />
            </div>
            <p>
              Won Tables: <span>{player2Info.points}</span>
            </p>
            <p>
              Won Rounds: <span> {player2Info.roundsWon}</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayersInfo;