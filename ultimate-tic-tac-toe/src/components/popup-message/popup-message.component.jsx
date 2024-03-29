import React from "react";
import "./popup-message.css";

const PopupMessage = ({ message, isVisible }) => {
  return (
    <>
      {isVisible && (
        <div className="mount-div">
          <p>{message}</p>
        </div>
      )}
    </>
  );
};

export default PopupMessage;
