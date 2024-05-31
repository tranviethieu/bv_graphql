
export  const uniqueArray = (arr, prop) => arr.filter((obj, pos, array) => array.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos);

