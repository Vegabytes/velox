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
export const formatDateShort = dateString => {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedDate = dd + '/' + mm + '/' + yyyy + ':';
  return formattedDate;
}


function padTwoDigits(num) {
  return num.toString().padStart(2, "0");
}

export const dateInYyyyMmDdHhMmSs = (datString, dateDiveder = '/') => {
  const date = new Date(datString);
  return (
    [
      padTwoDigits(date.getDate()),
      padTwoDigits(date.getMonth() + 1),
      date.getFullYear(),
    ].join(dateDiveder) +
    " " +
    [
      padTwoDigits(date.getHours()),
      padTwoDigits(date.getMinutes()),
      padTwoDigits(date.getSeconds()),
    ].join(":")
  );
}


