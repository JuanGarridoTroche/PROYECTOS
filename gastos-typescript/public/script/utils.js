// Obtener un número al azar como Id del nuevo asiento bancario
export function getRandomId() {
    return Math.floor(Math.random() * Date.now());
}
