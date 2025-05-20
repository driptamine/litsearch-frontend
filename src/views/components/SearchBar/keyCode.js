// REFERENCE https://stackoverflow.com/questions/27931610/how-do-i-get-my-keycode-to-focus-the-element

window.addEventListener('keydown', keydownCallback);

function keydownCallback(event) {
  if (event.keyCode === 191) {
    setTimeout(setFocusToTextBox); // setTimeout prevents insertion of slash
  }
}

function setFocusToTextBox() {
  document.getElementById("order_number").focus();
}

// REFERENCE https://stackoverflow.com/questions/16006583/capturing-ctrlz-key-combination-in-javascript
function nextHotkey(event) {
  if (event.altKey && event.rightArrowKey ) {
    setTimeout(setFocusToTextBox); // setTimeout prevents insertion of slash
  }
}

function previousHotkey(event) {
  if (event.altKey && event.leftArrowKey ) {
    setTimeout(setFocusToTextBox); // setTimeout prevents insertion of slash
  }
}

<input id="order_number" placeholder="Press / and I will be focused" size="60">
