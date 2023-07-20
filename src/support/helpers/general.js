export const formatDate = dateString => {
  const timeStamp = new Date(dateString);
  return timeStamp.toLocaleString("es-ES",
    { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
export const formatBytes = (bytes, precision = 2) => {
  if (isNaN(parseFloat(bytes)) || !isFinite(bytes) || bytes === 0) return '-';
  const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
    number = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
}


