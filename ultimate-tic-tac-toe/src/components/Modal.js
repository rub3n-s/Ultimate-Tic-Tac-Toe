import "./Modal.css";
import {useRef} from 'react';

const Modal = ({ open, gameMode, onHide }) => {  
  switch (gameMode) {
    case "PVC":
      console.log("Player vs Computer Modal");
      break;
    case "PVP":
      console.log("Player vs Player Modal");
      break;
  }
  
  return (
    <>
      {open && (
        <div
          id="modal-playersName"
          className="w3-modal"
          role="dialog"
        >
          <div className="w3-modal-content w3-card-4 w3-animate-zoom styles">
            <header>
              <span
                className="w3-button w3-display-topright closeModal"
                data-modalid="playersName" onClick={onHide}
              >
                &times;
              </span>
              <div>What's your Name?</div>
            </header>
            <div className="info" id="nickname1">
              Player's 1 Nick Name:
              <input
                type="text"
                id="inputNick1"
                size="16"
                width="100"
                placeholder="Insert your NickName"
              />
            </div>
            {gameMode == "PVP" && (
              <div className="info" id="nickname2">
                Player's 2 Nick Name:
                <input
                  type="text"
                  id="inputNick2"
                  size="16"
                  placeholder="Insert your NickName"
                />
              </div>
            )}
            <div className="info-button">
              <button id="okNickName">ok</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
