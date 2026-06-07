function App() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  return (
    <div className="App">
      <h1>Parent container</h1>
      <h3>This is just a demo container</h3>
      <button onClick={() => setIsModalVisible(true)}>open modal</button>
      {isModalVisible && (
        <Modal onModalClose={() => setIsModalVisible(false)}>
          <Modal.Header>SomeHeader</Modal.Header>
          <Modal.Body>SomeBody</Modal.Body>
          <Modal.Footer>
            <Modal.Footer.CloseBtn>SomeClose</Modal.Footer.CloseBtn>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}