import { useState, useEffect } from "react";
import Layout from "./components/layouts/Layout";
import Welcome from "./components/layouts/Welcome";
import Dashboard from "./components/layouts/Dashboard";
import Challenge from "./components/layouts/Challenge";
import WORDS from "./utils/VOCAB.json";
import { countdownIn24Hours, getWordByIndex, PLAN } from "./utils/index";

function App() {
  const [selectedPage, setSelectedPage] = useState(0);
  const [name, setName] = useState("");
  const [day, setDay] = useState(1);
  const [datetime, setDatetime] = useState(null);
  const [history, setHistory] = useState({});
  const [attempts, setAttempts] = useState(0);

  const daysWords = PLAN[day].map((idx) => {
    return getWordByIndex(WORDS, idx).word;
  });

  const handleChangePage = (pageIndex) => {
    setSelectedPage(pageIndex);
  };

  const handleCreateAccount = () => {
    if (!name) return;
    localStorage.setItem("username", name);
    handleChangePage(1);
  };

  const handleIncrementAttempts = () => {
    // take current attempt count and save to localStorage
    const newRecord = attempts + 1;
    localStorage.setItem("attempts", newRecord);
    setAttempts(newRecord);
  };

  const handleCompleteDay = () => {
    const newDay = day + 1;
    const newDateTime = Date.now();
    setDay(newDay);
    setDatetime(newDateTime);

    localStorage.setItem(
      "day",
      JSON.stringify({ day: newDay, datetime: newDateTime })
    );
    setSelectedPage(1);
  };

  useEffect(() => {
    if (!localStorage) return;

    if (localStorage.getItem("username")) {
      setName(localStorage.getItem("username"));
      setSelectedPage(1);
    }

    if (localStorage.getItem("attempts")) {
      setAttempts(parseInt(localStorage.getItem("attempts")));
    }

    if (localStorage.getItem("history")) {
      setHistory(JSON.parse(localStorage.getItem("history")));
    }

    if (localStorage.getItem("day")) {
      const { day: d, datetime: dt } = JSON.parse(localStorage.getItem("day"));
      setDatetime(dt);
      setDay(d);

      if (d > 1 && dt) {
        const diff = countdownIn24Hours(dt);
        if (diff < 0) {
          let newHistory = { ...history };
          const timestamp = new Date(dt);
          const formattedTimestamp = timestamp
            .toString()
            .split(" ")
            .slice(1, 4)
            .join(" ");

          newHistory[formattedTimestamp] = d;
          setHistory(newHistory);
          setDay(1);
          setDatetime(null);
          setAttempts(0);

          localStorage.setItem("attempts", 0);
          localStorage.setItem("histoy", JSON.stringify(newHistory));
          localStorage.setItem(
            "day",
            JSON.stringify({
              day: 1,
              datetime: null,
            })
          );
        }
      }
    }
  }, []);

  const pages = {
    0: (
      <Welcome
        name={name}
        setName={setName}
        handleCreateAccount={handleCreateAccount}
      />
    ),
    1: (
      <Dashboard
        name={name}
        day={day}
        attempts={attempts}
        PLAN={PLAN}
        handleChangePage={handleChangePage}
        daysWords={daysWords}
        datetime={datetime}
        history={history}
      />
    ),
    2: (
      <Challenge
        daysWords={daysWords}
        handleChangePage={handleChangePage}
        day={day}
        handleIncrementAttempts={handleIncrementAttempts}
        handleCompleteDay={handleCompleteDay}
        PLAN={PLAN}
      />
    ),
  };

  return (
    <>
      <Layout>{pages[selectedPage]}</Layout>
    </>
  );
}

export default App;
