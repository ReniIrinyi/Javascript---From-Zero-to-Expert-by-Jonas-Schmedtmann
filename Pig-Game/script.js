'use strict';
//selecting elements

//selecting by class
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const diceEL = document.querySelector('.dice');
const btnRoll = document.querySelector('.btn--roll');
const btnNew = document.querySelector('.btn--new');
const btnHold = document.querySelector('.btn--hold');

// selecting by ID with #
const score0El = document.querySelector('#score--0');
//get ElementByID need no dot (.)
const score1El = document.getElementById('score--1');
const currScore0EL = document.getElementById('current--0');
const currScore1EL = document.getElementById('current--1');

//starting conditions
// score0El.textContent = 0;
// score1El.textContent = 0;
// diceEL.classList.add('hidden');

// variable for the current score
//welche player ist der active player?
//um speichern der Punktzahlenhaben wir variablen erstellt, Scores-array holds the scores von player 1 (at position 0; and player 1 (at position 1))
//wenn der aktuelle Spieler SpeechRecognitionAlternative, wird 0, und wird 1 wenn der active-player spielt.
// const scores = [0, 0]; //wir speichern die Ergebnisse der Spieler in einem Array, das sind die final scores
// let currentScore = 0;
// let activePlayer = 0;

//is the game still splaying? siehe finish the game
//let playing = true;

//new function to start the game new : we put the scores in that function, and paste überall aus DRY prinzip - auch starting conditions put we in
let playing, scores, currentScore, activePlayer;

const init = function () {
  playing = true;
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;

  score0El.textContent = 0;
  score1El.textContent = 0;
  currScore0EL.textContent = 0;
  currScore1EL.textContent = 0;

  diceEL.classList.add('hidden');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
  diceEL.classList.toggle('hidden');
  btnRoll.classList.toggle('hidden');
  btnHold.classList.toggle('hidden');
};
init();
// console error => playing is not defined
//thats because of "Scoping" => the variable, inside the function there are only avaible inside that Init- function!!! there are NOT excessibel outside the function. there are "scoped" in that init function, also sie sind auf diese Init Function beschränkt, because this is where i deklared them. Solution => deklair the variable OUTSIDE the function -- LEER let playing, scores, currentScore, activePlayer;

//function to switch the player
const switchPlayer = function () {
  //we don´t need any parameters, because both situation are the same
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
};

//Rolling dice conditions
btnRoll.addEventListener('click', function () {
  // finish game if/else statment if playing=true === if playing =>doesnt need =true
  if (playing) {
    //random dice Roll
    const diceNr = Math.trunc(Math.random() * 6) + 1;
    //   console.log(diceNr);
    //display dice
    diceEL.classList.remove('hidden');
    diceEL.src = `dice-${diceNr}.png`;

    //check for rolled 1: if true, switch to the  next player
    if (diceNr !== 1) {
      //add dice to the current store
      //currentScore=currentScore+diceNr => röviditve:
      currentScore += diceNr;
      //building ID-name dinamic
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      currentScore = 0;
      document.getElementById(`current--${activePlayer}`).textContent = 0;
      // //Switch to the next player

      // //when we switch the player, we need to change the value of >>activePlayer<< from 0 to 1, or from 1 to 0.
      // activePlayer = activePlayer === 0 ? 1 : 0; //if the active player is 0, than be 1, else 0 => wir weisen den aktiven Spieler hier neu zu.

      // // .toggle add Element if it is no there, and remove if it is there -- easier then remove/add and contains
      // player0El.classList.toggle('player--active');
      // player1El.classList.toggle('player--active');

      //we made the function for that, so we paste simply the function in
      switchPlayer();
    }
  }
});

// hold button eventListener
// add current score to active player, and check if players score is >=100, switch to the next player
btnHold.addEventListener('click', function () {
  if (playing) {
    //   console.log('Hold button');
    scores[activePlayer] += currentScore; //scores[1] = scores [1] + currentScore
    //   console.log(scores[activePlayer]);
    //   document.getElementById(`current--${activePlayer}`).textContent =
    //     scores[activePlayer];
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    // switch to the next player, and show if the score 100?
    // DRY prinzip => don´trepeat yourself, we build a function for that ==> ich mache das function VOR addEventListener, und paste in beide Stellen ein.
    // currentScore = 0;
    // document.getElementById(`current--${activePlayer}`).textContent = 0;
    // activePlayer = activePlayer === 0 ? 1 : 0;
    // player0El.classList.toggle('player--active');
    // player1El.classList.toggle('player--active');

    //there is a Problem: current score doesn´t saved in the total `big`score. Es wandelt sich immer wieder auf 0 zurück when player was switched.
    // debugging prozess: 1. Hold button =>checked with console.log
    //2. activePlayer array checked =>score wird korrekt berechnet, aber wird nicht angezeigt ==>>
    //document.getElementById(`current--${activePlayer}`).textContent =
    //scores[activePlayer]; is inkorrekt!!! must to be not current-- => score!!

    //there is an another one problem: score max must to be by 100!!

    if (scores[activePlayer] >= 10) {
      playing = false;
      diceEL.classList.toggle('hidden');
      btnRoll.classList.toggle('hidden');
      btnHold.classList.toggle('hidden');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      // there is an another bug: //it doesnt change to the player-winner class... we are //missing the dot (.)!!!!If we are selecting on base on the class, we need a dot. :
      //document.querySelector(`.player--${activePlayer}`
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
    } else {
      switchPlayer();
    }
  }
});
//Finish the game - make a variable, that host the state of the game, if we are still playing or not? If the game is splaying is everithing normally, if not, if the game is finished - hidden buttons etc. make a boolien value of the TOP of the code let playing=true, than if the game finished set es false!! The hole code shoud be only executed, if playing=true, id doesnt ==> game finished

btnNew.addEventListener('click', init);
