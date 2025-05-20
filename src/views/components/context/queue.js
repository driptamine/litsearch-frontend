// REFERENCE https://stackoverflow.com/questions/9456238/i-want-to-play-a-multiple-sound-files-base-on-queue

//This plays a file, and call a callback once it completed (if a callback is set)

function play(audio, callback) {

  audio.play();
  if(callback) {
      audio.onended = callback;
  }
}


// This gets an array of audio objects and actually impements the queue

function queue_sounds(sounds){
  var index = 0;

  function recursive_play() {
    if(index+1 === sounds.length) {
      play(sounds[index],null);
    } else {
      play(
        sounds[index],
        function(){
          index++;
          recursive_play();
        }
      );
    }
  }

  recursive_play();
}

queue_sounds([new Audio(foo), new Audio(bar), new Audio(lol)]);



// REFERENCE: https://github.com/video-react/video-react/issues/184
document.addEventListener('keydown', (e) => {
  if (e.keyCode === 32) {
    // this.ref.player.pause();
    play();
  }
})
