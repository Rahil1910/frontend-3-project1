import styles from "./index.module.css";
import { useState, useEffect } from "react";

function SetTimer() {
  const [timers, setTimers] = useState([]);
  const [data, setTimer] = useState({
    hour: "",
    min: "",
    sec: "",
  });

  const alarmSound = new Audio("./audio.wav");

  const onSet = (e) => {
    e.preventDefault();
    const newHour = data.hour ? Number(data.hour) : 0;
    const newMin = data.min ? Number(data.min) : 0;
    const newSec = data.sec ? Number(data.sec) : 0;

    setTimers((prevTimers) => [
      ...prevTimers,
      {
        ...data,
        id: Date.now(), 
        hour: newHour,
        min: newMin,
        sec: newSec,
        running: true,
        completed: false,
      },
    ]);
    setTimer({ hour: "", min: "", sec: "" });
  };

  const onInput = (e) => {
    const { value, name } = e.target;
    setTimer((prev) => ({ ...prev, [name]: value }));
  };

  const onDel = (ID) => {
    setTimers((prevTimers) => prevTimers.filter((timer) => timer.id !== ID));
  };

  useEffect(() => {
    const intervals = timers.map((timer, index) => {
      if (timer.running) {
        return setInterval(() => {
          setTimers((prevTimers) => {
            const newTimers = [...prevTimers];
            const currentTimer = newTimers[index];

            if (currentTimer.sec > 0) {
              currentTimer.sec -= 1;
            } else if (currentTimer.min > 0) {
              currentTimer.min -= 1;
              currentTimer.sec = 59;
            } else if (currentTimer.hour > 0) {
              currentTimer.hour -= 1;
              currentTimer.min = 59;
              currentTimer.sec = 59;
            }

            if (currentTimer.hour === 0 && currentTimer.min === 0 && currentTimer.sec === 0) {
              currentTimer.running = false;
              currentTimer.completed = true;
              alarmSound.play(); 
              clearInterval(intervals[index]); 
            }

            return newTimers;
          });
        }, 1000);
      }
      return null;
    });

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [timers]);

  return (
    <>
      <h1 className={styles.h1}>Multiple Timers App</h1>
      <div className={styles.setTimecase}>
        <p>Set Time:</p>
        <div className={styles.inputCase}>
          <input
            className={styles.input}
            type="number"
            placeholder="00"
            onChange={onInput}
            name="hour"
            value={data.hour.padStart(2, "0")}
          />
          <span>:</span>
          <input
            className={styles.input}
            type="number"
            placeholder="00"
            onChange={onInput}
            name="min"
            value={data.min.padStart(2, "0")}
          />
          <span>:</span>
          <input
            className={styles.input}
            type="number"
            placeholder="00"
            onChange={onInput}
            name="sec"
            value={data.sec.padStart(2, "0")}
          />
        </div>
        <button className={styles.btn} onClick={onSet}>
          Set
        </button>
      </div>
      <h4>Current Timers</h4>
      <div>
        {timers.map((timer) => (
          <div
            key={timer.id}
            className={`${styles.setTimecase} ${timer.completed ? styles.completed : ""}`}
          >
            {timer.completed ? (
              <div className={styles.timesUpText}>Times Up</div> 
            ) : (
              <>
                <p>Time Left:</p>
                <div className={styles.inputCase}>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="00"
                    name="hour"
                    value={String(timer.hour).padStart(2, "0")}
                    readOnly
                  />
                  <span>:</span>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="00"
                    name="min"
                    value={String(timer.min).padStart(2, "0")}
                    readOnly
                  />
                  <span>:</span>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="00"
                    name="sec"
                    value={String(timer.sec).padStart(2, "0")}
                    readOnly
                  />
                </div>
                <button className={styles.btn} onClick={() => onDel(timer.id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default SetTimer;
