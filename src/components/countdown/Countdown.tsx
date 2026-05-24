import React, { useState, useEffect } from 'react';

export const Countdown: React.FC = () => {
  const [countDays, setCountDays] = useState('');
  const [countHours, setCountHours] = useState('');
  const [countMinutes, setCountMinutes] = useState('');
  const [countSeconds, setCountSeconds] = useState('');

  const dateTarget = new Date('31 January, 2019 12:00');

  const setCountDown = () => {
    const today = new Date();
    const dateDifference = dateTarget.valueOf() - today.valueOf();

    const day = Math.trunc(dateDifference / (1000 * 60 * 60 * 24));
    let rem = dateDifference % (1000 * 60 * 60 * 24);

    const hours = Math.trunc(rem / (1000 * 60 * 60));
    rem = rem % (1000 * 60 * 60);

    const min = Math.trunc(rem / (1000 * 60));
    rem = rem % (1000 * 60);

    const sec = Math.trunc(rem / 1000);

    setCountDays(day.toString());
    setCountHours(hours.toString());
    setCountMinutes(min.toString());
    setCountSeconds(sec.toString());
  };

  useEffect(() => {
    setCountDown(); // run once immediately

    const interval = setInterval(() => {
      setCountDown();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <p>
      Extend your mind in: {countDays} days {countHours} hours {countMinutes} minutes {countSeconds} seconds
    </p>
  );
};
export default Countdown;
