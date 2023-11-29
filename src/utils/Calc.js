const msToMinSec = (ms) => {
  if (!ms) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const formattedMinutes = minutes < 10 ? `${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  if (hours > 0) {
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
};

const formatDate = (date) => {
  const dateAsDateObj = new Date(date);
  const options = { year: "numeric", month: "short" };
  return dateAsDateObj.toLocaleDateString("en-US", options);
};

export { msToMinSec, formatDate };
