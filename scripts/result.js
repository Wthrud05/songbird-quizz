const result = document.querySelector('.result');
const score = localStorage.getItem('userScore');
console.log(score);
result.textContent = score;
