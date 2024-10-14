// Clock.js
import React, { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="clock-container">
      <p className="time">{time.toLocaleTimeString()}</p>
    </div>
  );
};

export default Clock;
