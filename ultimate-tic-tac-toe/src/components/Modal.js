import "./Modal.css";

const Modal = ({ open, title, info, onHide }) => {
  return (
    <>
      {open && (
        <div id="modal-generic" className="w3-modal" role="dialog">
          <div className="w3-modal-content w3-card-4 w3-animate-zoom styles">
            <header>
              <span
                className="w3-button w3-display-topright closeModal"
                data-modalid="generic"
                onClick={onHide}
              >
                &times;
              </span>
              <div>{title}</div>
            </header>

            {
              /* 'info' is the generated html in each component that calls a modal */
              info
            }
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
