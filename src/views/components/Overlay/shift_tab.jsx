// REFERENCE https://tinloof.com/blog/how-to-create-an-accessible-react-modal

function App() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  return (
    <div className="App">
      <h1>Parent container</h1>
      <h3>This is just a demo container</h3>
      <button onClick={() => setIsModalVisible(true)}>open modal</button>
      {isModalVisible && (
        <Modal onModalClose={() => setIsModalVisible(false)}>
          <Modal.Header>Header</Modal.Header>
          <Modal.Body>Body</Modal.Body>
          <Modal.Footer>
            <Modal.Footer.CloseBtn>Close</Modal.Footer.CloseBtn>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}


const modalContext = React.createContext();

function Modal({ children, onModalClose }) {
  // ESCAPE BUTTON
  React.useEffect(() => {
    function keyListener(e) {
      const listener = keyListenersMap.get(e.keyCode);
      return listener && listener(e);
    }
    document.addEventListener("keydown", keyListener);

    return () => document.removeEventListener("keydown", keyListener);
  });

  const modalRef = React.createRef();
  const handleTabKey = e => {
    const focusableModalElements = modalRef.current.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = focusableModalElements[0];
    const lastElement = focusableModalElements[focusableModalElements.length - 1];

    if (!e.shiftKey && document.activeElement !== firstElement) {
      firstElement.focus();
      return e.preventDefault();
    }

    if (e.shiftKey && document.activeElement !== lastElement) {
      lastElement.focus();
      e.preventDefault();
    }
  };

  const keyListenersMap = new Map([
    [27, onModalClose],
    [9, handleTabKey]
  ]);

  return ReactDOM.createPortal(
    <div className="modal-container" role="dialog" aria-modal="true">
      <div className="modal-content" ref={modalRef}>
        <ModalContext.Provider value={{ onModalClose }}>
          {children}
        </ModalContext.Provider>
      </div>
    </div>,
    document.body
  );
}

Modal.Header = function ModalHeader(props) {
  const { onModalClose } = React.useContext(modalContext);

  return (
    <div className="modal-header">
      {props.children}
      <button className="cross-btn" title="close modal" onClick={onModalClose}>
        ✕
      </button>
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
  const { onModalClose } = React.useContext(modalContext);
  return (
    <button
      {...props}
      className="close-btn"
      title="close modal"
      onClick={onModalClose}
    />
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
