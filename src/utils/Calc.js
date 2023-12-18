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

const formatFollowerCount = (count) => {
  if (count < 1000) return count;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  if (count < 1000000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count < 1000000000000) return `${(count / 1000000000).toFixed(1)}B`;
  if (count < 1000000000000000) return `${(count / 1000000000000).toFixed(1)}T`;
};

export { msToMinSec, formatDate, formatFollowerCount };
