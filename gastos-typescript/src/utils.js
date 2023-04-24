"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomId = void 0;
// Obtener un número al azar como Id del nuevo asiento bancario
function getRandomId() {
    return Math.floor(Math.random() * Date.now());
}
exports.getRandomId = getRandomId;
