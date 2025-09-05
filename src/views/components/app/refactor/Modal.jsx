import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

const ModalContext = React.createContext();

function Modal({ children, onModalClose }) {
  const modalRef = React.useRef();

  const handleTabKey = React.useCallback(e => {
    const focusableModalElements = modalRef.current.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = focusableModalElements[0];
    const lastElement = focusableModalElements[focusableModalElements.length - 1];

    if (e.key === 'Tab') {
      if (!e.shiftKey && document.activeElement !== firstElement) {
        firstElement.focus();
        e.preventDefault();
      } else if (e.shiftKey && document.activeElement !== lastElement) {
        lastElement.focus();
        e.preventDefault();
      }
    }
  }, []);

  React.useEffect(() => {
    const keyListenersMap = new Map([
      [27, onModalClose], // Escape key
      [9, handleTabKey],  // Tab key
    ]);

    function keyListener(e) {
      const listener = keyListenersMap.get(e.keyCode);
      return listener && listener(e);
    }
    document.addEventListener("keydown", keyListener);

    return () => document.removeEventListener("keydown", keyListener);
  }, [onModalClose, handleTabKey]);

  return ReactDOM.createPortal(
    <div className="AYOO">
      <div className="modal-content-1" ref={modalRef}>
        <ModalContext.Provider value={{ onModalClose }}>
          {children}
        </ModalContext.Provider>
      </div>
      {/* You had multiple modal-content divs. Consider if these are truly separate modals or just different sections of one modal.
          If separate, they should likely be separate Modal components or handled differently.
          For now, I'm keeping the structure but commenting out the redundant ones for clarity.
      */}
      {/*
      <div className="modal-content-2" ref={modalRef}>
        <ModalContext.Provider value={{ onModalClose }}>
          <Modal.Header>Feed</Modal.Header>
          <Modal.Body>Pitchfork</Modal.Body>
        </ModalContext.Provider>
      </div>
      <div className="modal-content-3" ref={modalRef}>
        <ModalContext.Provider value={{ onModalClose }}>
          <Modal.Header>Music Player</Modal.Header>
          <Modal.Body>Pitchfork</Modal.Body>
        </ModalContext.Provider>
      </div>
      */}
      <div className="modal-container" role="dialog" aria-modal="true"></div>
    </div>,
    document.body
  );
}

Modal.Header = function ModalHeader(props) {
  const { onModalClose } = useContext(ModalContext);
  return (
    <div className="modal-header">
      {props.children}
      {/* Uncomment if you want a close button in the header */}
      {/*<button className="cross-btn" title="close modal" onClick={onModalClose}>
        ✕
      </button>*/}
    </div>
  );
};

Modal.Body = function ModalBody(props) {
  return <div className="modal-body">{props.children}</div>;
};

Modal.Footer = function ModalFooter(props) {
  return <div className="modal-footer">{props.children}</div>;
};

Modal.Footer.CloseBtn = function CloseBtn(props) {
  const { onModalClose } = useContext(ModalContext);
  return (
    <button
      {...props}
      className="close-btn"
      title="close modal"
      onClick={onModalClose}
    />
  );
};

export default Modal;
