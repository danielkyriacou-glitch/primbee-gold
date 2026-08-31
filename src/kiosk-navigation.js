export const HOME_PATH = '../../index.html';
export function goHome(saveGame, locationObject = window.location) { saveGame(); locationObject.replace(HOME_PATH); }
