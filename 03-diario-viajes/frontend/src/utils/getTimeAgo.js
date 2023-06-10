const DATE_UNITS = {
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};

// Función que calcula la diferencia en segundos entre dos fechas
const getSecondsDiff = (timestamp) => (Date.now() - timestamp) / 1000;

// Función que decide qué unidad se va a utilizar para expresar la diferencia entre las fechas. Si el número de segundos de diferencia es mayor que 86400 va a expresarlo en días. Si está entre 3600 y 86400 en horas. Entre 60 y 3600 en minutos. Menos de 60 en segundos
// Una vez decidida la unidad (es lo que hace el if), calcula la cantidad de dicha unidad (ej: si la diferencia en segundos era de 7200 segundos, nos dará 2 horas)
const getUnitAndValueDate = (secondsElapsed) => {
  for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
    if (secondsElapsed >= secondsInUnit || unit === "second") {
      const value = Math.floor(secondsElapsed / secondsInUnit) * -1;
      return { value, unit };
    }
  }
};

// Dada una fecha, calcula la diferencia entre esa fecha y hoy, decide en qué unidad expresar esa diferencia y devuelve un texto en el idioma del usuario expresando dicha diferencia
const getTimeAgo = (timestamp) => {
  const rtf = new Intl.RelativeTimeFormat();

  const secondsElapsed = getSecondsDiff(timestamp);
  const { value, unit } = getUnitAndValueDate(secondsElapsed);
  return rtf.format(value, unit);
};

export default getTimeAgo;
