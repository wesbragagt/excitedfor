function makeGetTimeBetween(rule) {
  return (date1, date2) => {
    // Convert both dates to milliseconds
    const date1_ms = date1.getTime();
    const date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    const difference_ms = Math.abs(date2_ms - date1_ms);

    // Convert back to days and return
    return Math.round(difference_ms / rule);
  };
}

const Time = Object.freeze({
  WEEK: 1000 * 60 * 60 * 24 * 7,
  DAY: 1000 * 60 * 60 * 24,
  HOUR: 1000 * 60 * 60,
  MINUTES: 1000 * 60,
  SECONDS: 1000,
});

const weeksBetween = makeGetTimeBetween(Time.WEEK);
const daysBetween = makeGetTimeBetween(Time.DAY);
const hoursBetween = makeGetTimeBetween(Time.HOUR);
const minutesBetween = makeGetTimeBetween(Time.MINUTES);
const secondsBetween = makeGetTimeBetween(Time.SECONDS);

export function getCountdownTowards(date: string) {
  const weeks = weeksBetween(new Date(date), new Date());
  const days = daysBetween(new Date(date), new Date());
  const hours = hoursBetween(new Date(date), new Date());
  const minutes = minutesBetween(new Date(date), new Date());
  const seconds = secondsBetween(new Date(date), new Date());

  return {
    weeks,
    days,
    hours,
    minutes,
    seconds,
  };
}
