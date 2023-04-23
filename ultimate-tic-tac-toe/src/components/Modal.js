import "./Modal.css";
import { useRef, useState } from "react";

const Modal = ({ open, gameMode, onHide, getNickNames }) => {
  const [nickName1, setNickName1] = useState("");
  const [nickName2, setNickName2] = useState("");
  const nickName1Input = useRef(null);
  const nickName2Input = useRef(null);

  const nickNameValidation = () => {
    switch (gameMode) {
      case "pvc":
        if (nickName1 == "")
          nickName1Input.current.classList.add("invalid-input");
        else {
          nickName1Input.current.classList.remove("invalid-input");
          getNickNames(nickName1, nickName2);
        }
        break;
      case "pvp":
        if (nickName1 == "")
          nickName1Input.current.classList.add("invalid-input");
        else if (nickName2 == "")
          nickName2Input.current.classList.add("invalid-input");
        else {
          nickName1Input.current.classList.remove("invalid-input");
          nickName2Input.current.classList.remove("invalid-input");
          getNickNames(nickName1, nickName2);
        }
        break;
    }
  };

  return (
    <>
      {open && (
        <div id="modal-playersName" className="w3-modal" role="dialog">
          <div className="w3-modal-content w3-card-4 w3-animate-zoom styles">
            <header>
              <span
                className="w3-button w3-display-topright closeModal"
                data-modalid="playersName"
                onClick={onHide}
              >
                &times;
              </span>
              <div>What's your Name?</div>
            </header>
            <div className="info" id="nicknickName1">
              Player's 1 Nick Name:
              <input
                type="text"
                id="inputNick1"
                size="16"
                width="100"
                placeholder="Insert Player's 1 NickName"
                onChange={(e) => setNickName1(e.target.value)}
                ref={nickName1Input}
              />
            </div>
            {gameMode == "PVP" && (
              <div className="info" id="nicknickName2">
                Player's 2 Nick Name:
                <input
                  type="text"
                  id="inputNick2"
                  size="16"
                  placeholder="Insert Player's 2 NickName"
                  onChange={(e) => setNickName2(e.target.value)}
                  ref={nickName2Input}
                />
              </div>
            )}
            <div className="info-button">
              <button id="okNickName" onClick={nickNameValidation}>
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
