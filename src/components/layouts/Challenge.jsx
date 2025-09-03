import { isEncountered, shuffle } from "../../utils";
import ProgressBar from "../ProgressBar";
import { Children, useState } from "react";
import DEFINITIONS from "../../utils/VOCAB.json";

const Challenge = (props) => {
  const {
    daysWords,
    handleChangePage,
    day,
    handleIncrementAttempts,
    handleCompleteDay,
    PLAN,
  } = props;

  const [wordIndex, setWordIndex] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [showDefinition, setShowDefinition] = useState(false);
  const [listToLearn, setListToLearn] = useState([
    ...daysWords,
    ...shuffle(daysWords),
    ...shuffle(daysWords),
    ...shuffle(daysWords),
  ]);

  const word = listToLearn[wordIndex];
  const isNewWord =
    showDefinition ||
    (!isEncountered(day, word) && wordIndex < daysWords.length);
  const definition = DEFINITIONS[word];

  const giveUp = () => {
    setListToLearn([...listToLearn, word]);
    setShowDefinition(true);
  };

  return (
    <>
      <section id="challenge">
        <h1>{word} </h1>
        {isNewWord && <p> {definition}</p>}
        <div className="helper">
          <div>
            {[...Array(definition.length).keys()].map((char, charIdx) => {
              const styleToApply =
                inputVal.length < char + 1
                  ? ""
                  : inputVal.split("")[charIdx].toLowerCase() ==
                    definition.split("")[charIdx].toLowerCase()
                  ? "correct"
                  : "incorrect";

              return <div className={" " + styleToApply} key={charIdx}></div>;
            })}
          </div>
          <input
            value={inputVal}
            onChange={(e) => {
              if (
                e.target.value.length == definition.length &&
                e.target.value.length > inputVal.length
              ) {
                // compare words
                handleIncrementAttempts();
                if (e.target.value.toLowerCase() == definition.toLowerCase()) {
                  // Correct outcome
                  if (wordIndex >= listToLearn.length - 1) {
                    handleCompleteDay();
                    return;
                  }
                  setWordIndex(wordIndex + 1);
                  setShowDefinition(false);
                  setInputVal("");
                  return;
                }
              }

              setInputVal(e.target.value);
            }}
            type="text"
            placeholder="Enter the definition"
          />
          <div className="challenge-btns">
            <button
              onClick={() => {
                handleChangePage(1);
              }}
              className="card-button-secondary"
            >
              <h6>Quit</h6>
            </button>
            <button onClick={giveUp} className="card-button-primary">
              <h6>I forgot</h6>
            </button>
          </div>
        </div>
        <ProgressBar
          text={`${wordIndex} / ${listToLearn.length}`}
          remainder={(wordIndex * 100) / listToLearn.length}
        />
      </section>
    </>
  );
};

export default Challenge;
