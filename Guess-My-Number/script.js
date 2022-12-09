'use strict';
document.querySelector('h1').textContent = 'Gondoltam egy számra... 🤔';
document.querySelector('.again').textContent = 'Újra próbálom!';
document.querySelector('.message').textContent =
  'Próbáld meg kitalálni mire gondoltam 🎃';
document.querySelector('.between').textContent =
  'Adj meg egy számot 1 és 20 között!';

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;
const message = function (text) {
  document.querySelector('.message').textContent = text;
};

document.querySelector('.check').addEventListener('click', function () {
  const inputZahl = Number(document.querySelector('.guess').value);
  console.log(inputZahl);

  // document.querySelector('check').addEventListener('keydown', function (e) {
  //   if (e.key === 'Enter') {
  //     const inputZahl = Number(document.querySelector('.guess').value);
  //   }
  // });

  if (!inputZahl) {
    message('🤬 Ne szórakozz, adj meg egy számot! 🤬');
  } else if (inputZahl === secretNumber) {
    document.querySelector('.number').textContent = secretNumber;
    message('🤩 Eltatáltad, örülj magadnak! 🥳');
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';
    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }
  } else if (inputZahl !== secretNumber) {
    if (score > 1) {
      message(
        inputZahl > secretNumber
          ? '📈 túl magas számot adtál meg! 🤭'
          : '📉 túl alacsony számot adtál meg! 🤭'
      );
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      message('🔚 vége a játéknak, vesztettél 💩');
      document.querySelector('.score').textContent = 0;
    }
  }
});

document.querySelector('.again').addEventListener('click', function () {
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  score = 20;
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.score').textContent = score;
  document.querySelector('.number').textContent = '?';
  message('Próbáld meg kitalálni mire gondoltam 🎃');
  document.querySelector('.guess').value = '';
});
