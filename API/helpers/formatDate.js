export const formatOutgoingDate = (createdOnDate) => {
  const createdOn = JSON.stringify(createdOnDate);

  const dateTime = createdOn.slice(1, 20).split('T');

  const day = dateTime[0].split('-').join('');

  const timeBeforeFormat = dateTime[1].split(':').join('');

  const timezoneHour = Number(timeBeforeFormat.slice(0, 2)) + 1;

  const time = timezoneHour + timeBeforeFormat.slice(2);

  return day + time;
};

export const formatIncomingDate = (createdOn) => {
  let date = createdOn.slice(0, 8);

  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);

  date = [year, month, day].join('-');

  let time = createdOn.slice(8);

  const hour = time.slice(0, 2);
  const minute = time.slice(2, 4);
  const seconds = time.slice(4);

  time = [hour, minute, seconds].join(':');

  return `${date} ${time}`;
};
