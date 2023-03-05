const answers = Array.from(document.querySelectorAll('.answer-item'));
const categories = Array.from(document.querySelectorAll('.category-item'));

const nextBtn = document.querySelector('.next-level');
const nextLink = document.querySelector('.res-link');
const main = document.querySelector('main');
const mainContainer = main.querySelector('.container');

const startInfo = document.querySelector('#start-info');
const birdInfo = document.querySelector('.current-bird-info');

const scoreValue = document.querySelector('.score');

const birdImg = document.querySelector('.bird-img');
const birdName = document.querySelector('.bird-name');

const song = document.querySelector('.song');
const playBtn = document.querySelector('.play');
const playPause = document.querySelector('.audio-btn');

const playLineBox = document.querySelector('.playline');
const playLine = document.querySelector('.line');
const fullDuration = document.querySelector('.full-duraton');
const timeDuration = document.querySelector('.duration');

const birdInfoAudio = document.querySelector('.current-audio');
const birdInfoPlay = document.querySelector('.current-play');
const birdInfoPlayPause = document.querySelector('.current-audio-btn');

const currentplayLine = document.querySelector('.current-line');
const currentPlaylineBox = document.querySelector('.current-playline');
const currentFullDuration = document.querySelector('.current-full-duraton');
const currentTimeDuration = document.querySelector('.current-duration');

const correctSound = new Audio('../assets/sounds/correct.wav');
const wrongSound = new Audio('../assets/sounds/wrong.wav');

// Начальное состояние игры

let level = 0;
let score = 0;
let prevScore = score;
scoreValue.textContent = score;
let maxPoints = 6;

let currentBird = getRandomBird();
let currentSong = currentBird.audio;
song.src = currentSong;

let answerSet = new Set();
let isCorrect = false;

setTimeout(() => (fullDuration.textContent = getDuration(song.duration)), 1000);

// Отрисовка варинтов ответоа на основе текущей категории

function showAnswers() {
  categories.forEach((category, index) => {
    for (let i = 0; i < birdsData.length; i++) {
      if (category.classList.contains('active')) {
        answers[i].innerHTML = birdsData[index][i].name;
      }
    }
  });
}

// Получаем случайную птицу из текущей категории

function getRandomBird() {
  let bird;
  categories.forEach((el, index) => {
    for (let i = 0; i < birdsData.length; i++) {
      if (el.classList.contains('active')) {
        bird = birdsData[index][Math.floor(Math.random() * 6)];
      }
    }
  });
  return bird;
}

// Опеределяем правильный ответ

function isAnswerCorrect(answer) {
  let rightAnswer = currentBird.name;
  if (rightAnswer === answer) {
    return true;
  }
  return false;
}

// Показываем правльный ответ или нет

function showTrue(answer) {
  if (isCorrect && prevScore !== score) {
    return;
  }
  const circle = document.createElement('div');
  circle.classList.add('green');
  answer.append(circle);
  mainContainer.classList.add('right');
  correctSound.play();
  setTimeout(() => mainContainer.classList.remove('right'), 2000);
}

function showFalse(answer) {
  if (!isCorrect && prevScore !== score) {
    return;
  }
  const circle = document.createElement('div');
  circle.classList.add('red');
  answer.append(circle);
  mainContainer.classList.add('wrong');
  wrongSound.play();
  setTimeout(() => mainContainer.classList.remove('wrong'), 1000);
}

// Обработка клика по варианту ответа

function answerClickHandler(answer) {
  let answerValue = answer.textContent;
  isCorrect = isAnswerCorrect(answerValue);

  isCorrect ? showTrue(answer) : showFalse(answer);
  isAnswerClicked(answer);

  if (isCorrect && prevScore === score) {
    score += maxPoints;
  }
}

// Определяем был ли клик по варинту ответа

function isAnswerClicked(answer) {
  if (!answerSet.has(answer.textContent)) {
    answerSet.add(answer.textContent);
    maxPoints -= 1;
  }
}

// Показываем информацию о птице исходя из варианта ответа

function showBirdInfo(answer) {
  startInfo.style.display = 'none';
  birdInfo.style.display = 'flex';
  document.querySelector('.bird-desc').style.display = 'block';

  let clickedBird;

  birdsData.forEach((e) => {
    e.forEach((bird) => {
      if (bird.name === answer.textContent) {
        clickedBird = bird;
        birdInfo.querySelector('img').src = `${clickedBird.image}`;
        birdInfo.querySelector('h2').textContent = `${clickedBird.name}`;
        birdInfo.querySelector('p').textContent = `${clickedBird.species}`;
        birdInfo.querySelector('audio').src = `${clickedBird.audio}`;
        document.querySelector('.bird-desc').textContent = `${clickedBird.description}`;
      }
    });
  });
}

function hideBirdInfo() {
  startInfo.style.display = 'block';
  birdInfo.style.display = 'none';

  document.querySelector('.bird-desc').style.display = 'none';
}

function unlockNextLevel() {
  nextBtn.style.pointerEvents = 'unset';
  nextBtn.classList.add('unlock');
  nextBtn.removeAttribute('disabled');
}

// Следующий уровень

function levelUp() {
  categories[level].classList.remove('active');
  level += 1;
  categories[level].classList.add('active');

  nextBtn.classList.remove('unlock');
  nextBtn.setAttribute('disabled', true);
  nextBtn.style.pointerEvents = 'none';
}

function nextLevel() {
  if (level >= 5) {
    return;
  }

  levelUp();
  showAnswers();
  hideBirdInfo();
  currentBird = getRandomBird();
  currentSong = currentBird.audio;
  reset();

  setTimeout(() => (fullDuration.textContent = getDuration(song.duration)), 1000);

  answers.forEach((el) => (el.style.pointerEvents = 'unset'));

  if (level >= 5) {
    nextBtn.style.display = 'none';
    nextLink.style.display = 'inline';
    nextLink.addEventListener('click', function () {
      nextLink.style.display = 'none';
      localStorage.setItem('userScore', `${score}`);
    });
  }
}

// Цикл по вариантам ответов

answers.forEach((answer) => {
  answer.addEventListener('click', function () {
    showBirdInfo(answer);
    answerClickHandler(answer);
    birdInfoPlayPause.src = '../assets/images/play.svg';
    birdInfoPlay.classList.add('playable');
    birdInfoAudio.pause();
    setTimeout(() => (currentFullDuration.textContent = getDuration(birdInfoAudio.duration)), 1000);
    currentplayLine.style.width = '0%';

    if (isCorrect) {
      scoreValue.textContent = score;
      unlockNextLevel();
      birdImg.src = currentBird.image;
      birdName.textContent = currentBird.name;
      song.pause();
      birdInfoAudio.pause();

      if (level >= 5) {
        nextLink.classList.add('unlock-link');
      }
    }
  });
});

// Работа с плеером

function playSong(e, audio, button) {
  if (e.classList.contains('playable')) {
    e.classList.remove('playable');
    button.src = '../assets/images/pause.svg';
    audio.play();
  } else {
    e.classList.add('playable');
    button.src = '../assets/images/play.svg';
    audio.pause();
  }
}

function reset() {
  birdInfoPlayPause.src = '../assets/images/play.svg';
  birdInfoPlay.classList.add('playable');
  birdInfoAudio.pause();

  playPause.src = '../assets/images/play.svg';
  playBtn.classList.add('playable');
  song.pause();

  song.src = currentSong;
  birdImg.src = '../assets/images/unknownbird.jpg';
  birdName.textContent = '******';
  maxPoints = 6;
  prevScore = score;

  playLine.style.width = '0%';
  currentplayLine.style.width = '0%';
}

function update(e, el, line) {
  const { duration, currentTime } = e.srcElement;
  const percentage = (currentTime / duration) * 100;
  el.textContent = getDuration(currentTime);
  line.style.width = `${percentage}%`;
}

function getDuration(duration) {
  let time;
  let min = Math.floor(duration / 60);
  let sec = Math.floor(duration % 60);

  time = `${addZero(min)}:${addZero(sec)}`;

  return time;
}

function addZero(num) {
  return num < 10 ? '0' + num : num;
}

function playerProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = song.duration;

  song.currentTime = (clickX / width) * duration;
}

function currentPlayerProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = birdInfoAudio.duration;

  birdInfoAudio.currentTime = (clickX / width) * duration;
}

// Обработчики

window.addEventListener('load', function () {
  showAnswers();
});
nextBtn.addEventListener('click', function () {
  nextLevel();
});
playBtn.addEventListener('click', (e) => {
  playSong(e.target, song, playPause);
});
birdInfoPlay.addEventListener('click', (e) => {
  playSong(e.target, birdInfoAudio, birdInfoPlayPause);
});
song.addEventListener('timeupdate', function (e) {
  update(e, timeDuration, playLine);
});
birdInfoAudio.addEventListener('timeupdate', function (e) {
  update(e, currentTimeDuration, currentplayLine);
});
playLineBox.addEventListener('click', playerProgress);
currentPlaylineBox.addEventListener('click', currentPlayerProgress);
