function game() {
  const gameContainer = document.getElementById('game');
  const btnStart = document.querySelector('.start');

  window.addEventListener('DOMContentLoaded', function () {
    sessionStorage.clear();
    let record = document.createElement('h3');
    if (localStorage.record === undefined) {
      record.innerText = `No records yet`;
    } else {
      record.innerText = `best score yet: ${localStorage.record} tries`;
    }
    gameContainer.prepend(record);
  });
  const COLORS = [
    'red',
    'green',
    'blue',
    'orange',
    'purple',
    'red',
    'blue',
    'green',
    'orange',
    'purple',
  ];

  // here is a helper function to shuffle an array
  // it returns the same array with values shuffled
  // it is based on an algorithm called Fisher Yates if you want ot research more
  function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

  let shuffledColors = shuffle(COLORS);

  // this function loops over the array of colors
  // it creates a new div and gives it a class with the value of the color
  // it also adds an event listener for a click for each card
  function createDivsForColors(colorArray) {
    for (let color of colorArray) {
      // create a new div
      const newDiv = document.createElement('div');

      // give it a class attribute for the value we are looping over
      newDiv.classList.add(color);

      // call a function handleCardClick when a div is clicked on
      newDiv.addEventListener('click', handleCardClick);

      // append the div to the element with an id of game
      gameContainer.append(newDiv);
    }
  }

  let card1 = null;
  let card2 = null;
  let matchNumber = 0;
  let clicks = 0;

  function firstCard(event) {
    sessionStorage.setItem('match', matchNumber);
    card1 = event.target;
  }

  function secondCard(event) {
    card2 = event.target;
    console.log('ready card 2');
  }

  const divs = gameContainer.children;

  function handleCardClick(event) {
    // you can use event.target to see which element was clicked
    // console.log('you just clicked', event.target);

    // check if cards are assigned, or assign them a color:
    if (card1 !== null) {
      secondCard(event);
    } else {
      firstCard(event);
      console.log(card1.className);
    }

    // display card1 on click:
    card1.style.backgroundColor = card1.className;

    // check for two cards assigned:
    if (card1 !== null && card2 !== null) {
      // display card2:
      card2.style.backgroundColor = card2.className;
      // divs.removeEventListener('click', handleCardClick);
      for (div of divs) {
        div.removeEventListener('click', handleCardClick);
      }
      // add one try to the tries counter:
      clicks++;
      // card1.removeEventListener('click', handleCardClick);
      // card2.removeEventListener('click', handleCardClick);

      // update the try counter number:
      update();
      // capture if cards match:
      if (card1.className === card2.className && card1 !== card2) {
        console.log('match!!!'); // TODO: build cool popup
        // add one to the match count
        matchNumber++;
        card1.removeEventListener('click', handleCardClick);
        card1.classList.add('selected');
        card2.removeEventListener('click', handleCardClick);
        card2.classList.add('selected');
        sessionStorage.setItem('match', matchNumber);
        // capture if all cards match:
        if (sessionStorage.getItem('match') === '5') {
          // create winner message:
          document.querySelector('h2').remove();
          let congrats = document.createElement('h1');
          congrats.innerText = `SOLVED ON ${clicks} TRIES!`;
          // check it there's previous record:
          if (localStorage.record === undefined) {
            localStorage.setItem('record', clicks);
          } else {
            // set new value if it's a record win:
            if (localStorage.record >= clicks) {
              localStorage.setItem('record', clicks);
              congrats.innerText = `NEW RECORD!!! ${clicks} TRIES.`;
            } else {
              localStorage.getItem('record');
            }
          }
          // display the winner message:
          gameContainer.append(congrats);
          // button to restart game:
          let restartDiv = document.createElement('div');
          restartDiv.classList.add('restart-div');
          let btnRestart = document.createElement('button');
          btnRestart.innerText = 'Restart';
          restartDiv.append(btnRestart);
          gameContainer.append(restartDiv);
          btnRestart.addEventListener('click', function () {
            location.reload();
          });
        } else {
          card1 = null;
          card2 = null;
          for (div of divs) {
            if (!div.className.includes('selected')) {
              div.addEventListener('click', handleCardClick);
            } else {
              div.removeEventListener('click', handleCardClick);
            }
          }
        }
      } else {
        setTimeout(function () {
          card1.setAttribute('style', '');
          card2.setAttribute('style', '');
          card1 = null;
          card2 = null;
          for (div of divs) {
            div.addEventListener('click', handleCardClick);
          }
        }, 1000);
      }
    }
  }

  // let seconds = 0; (for timer's use)

  // when the DOM loads
  btnStart.addEventListener('click', function () {
    createDivsForColors(shuffledColors);
    btnStart.remove();
    tryCounter();
    // TODO: add a timer (don't know how to stop it)
    // clickDisplay(0);
    // let timer = document.createElement('h2');
    // gameContainer.append(timer);
    // let timeCount = setInterval(function () {
    //   seconds++;
    //   timer.innerText = `Your time: ${seconds}`;
    // }, 1000);
  });
  // try counter:
  function tryCounter() {
    let display = document.createElement('h2');
    display.innerText = 'Your tries: ';
    let displaySpan = document.createElement('span');
    displaySpan.innerText = clicks;
    display.append(displaySpan);
    gameContainer.append(display);
  }

  // update counter:
  function update() {
    const grab = document.querySelector('span');
    grab.innerText = clicks;
  }
}

game();
