import scoreBoard from "./localStorage.js";

// console.log(scoreBoard);
const listadoIntentos = document.querySelector(".intentos");

localStorage.setItem("scoreboard", JSON.stringify(scoreBoard));

//Retrieve the scoreboard and parse so it becomes an array of objects again
let scoreBoardLS = JSON.parse(localStorage.getItem("scoreboard"));

//Mostramos los usuarios ordenados por intentos:
scoreBoardLS.sort((a, b) => {
  return a.score - b.score;
});
for (let i = 0; i < scoreBoardLS.length; i++) {
  listadoIntentos.innerHTML += `<tr><td>${scoreBoardLS[i].name}</td><td>${scoreBoardLS[i].score}</td><td>${scoreBoardLS[i].time}</td></tr>`;
}

