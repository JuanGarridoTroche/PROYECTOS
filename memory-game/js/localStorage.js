"use strict";

const scoreBoardLS = window.localStorage.getItem("scoreBoard");

const scoreBoard = scoreBoardLS ? JSON.parse(scoreBoardLS) : [];

export default scoreBoard;