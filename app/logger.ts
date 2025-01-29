const currentDate = () => {
  const date = new Date(Date.now());
  const formattedDate = date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return formattedDate.replace(',', ' |');
};

const error = (message?: any, object?: any) => {
  console.error(`[${currentDate()}] Error: ${message}`);
  object && console.dir(object);
};

const info = (message?: any, object?: any) => {
  console.error(`[${currentDate()}] Info: ${message}`);
  object && console.dir(object);
};

const succuess = (message?: any, object?: any) => {
  console.error(`[${currentDate()}] Succuess: ${message}`);
  object && console.dir(object);
};

export default {
  error: error,
  info: info,
  succuess: succuess,
};
