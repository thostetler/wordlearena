import { useKeyboard } from "@react-aria/interactions";
import clsx from "clsx";
import React, { Reducer, useReducer } from "react";
import "./App.css";
import words from "./words.json";

interface AppState {
  readonly word: string;
  index: number;
  rows: string[];
}

const getRandomWord = () => {
  let min = 0,
    max = words.length - 1;
  min = Math.ceil(min);
  max = Math.floor(max);
  const index = Math.floor(Math.random() * (max - min) + min);
  return words[index];
};

type Action =
  | { type: "LETTER"; letter: string }
  | { type: "BACKSPACE" }
  | { type: "SUBMIT" };

const updateRow = (state: AppState, letter: string) => {
  console.log(state);
  if (letter !== "-1" && state.word.length === state.rows[state.index].length) {
    return state.rows;
  }
  let update = state.rows[state.index];
  if (letter === "-1") {
    update = update.slice(0, update.length - 1);
  } else {
    update += letter;
  }

  return [
    ...state.rows.slice(0, state.index),
    update,
    ...state.rows.slice(state.index + 1),
  ];
};

const handleSubmit = (state: AppState) => {
  if (state.rows[state.index].length < state.word.length) {
    // don't allow submit if the word isn't filled
    return state;
  }

  if (state.index >= state.rows.length - 1) {
    return { ...state, index: state.rows.length - 1 };
  }

  return {
    ...state,
    index: state.index + 1,
  };
};

const reducer: Reducer<AppState, Action> = (state, action) => {
  switch (action.type) {
    case "LETTER":
      return {
        ...state,
        rows: updateRow(state, action.letter),
      };
    case "BACKSPACE":
      return {
        ...state,
        rows: updateRow(state, "-1"),
      };
    case "SUBMIT":
      return handleSubmit(state);

    default:
      return state;
  }
};

const initialAppState: AppState = {
  word: getRandomWord(),
  index: 0,
  rows: ["", "", "", "", ""],
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialAppState);

  console.log("WORD: ", state.word);

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === "Backspace") {
        dispatch({ type: "BACKSPACE" });
      } else if (e.key === "Enter") {
        dispatch({ type: "SUBMIT" });
      } else if (e.code.startsWith("Key")) {
        // only allow normal letters otherwise
        dispatch({ type: "LETTER", letter: e.key });
      }
    },
  });

  return (
    <div
      className="h-screen w-screen bg-gray-600"
      tabIndex={1}
      {...keyboardProps}
    >
      <main className="container mx-auto flex flex-col space-y-2">
        {state.rows.map((word, index) => (
          <Word key={`row-${index}`} word={word} length={state.word.length} />
        ))}
      </main>
      {/* <input type="text" className="sr-only" value={state.word} readOnly /> */}
    </div>
  );
}

const Square = ({ letter }: { letter?: string }) => {
  const cls = clsx([""]);
  return (
    <div className="border-2 h-20 w-20 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white flex-1 uppercase">
      {letter}
    </div>
  );
};

const Word = ({
  word = "",
  length = 5,
}: {
  word?: string;
  length?: number;
}) => {
  let letters: string[] = [];

  if (word.length < length) {
    letters = word.padEnd(length, " ").split("");
  }

  if (word.length >= length) {
    letters = word.slice(0, length).split("");
  }

  console.log(letters);

  // const letters = word.split("");
  return (
    <div className={`flex justify-evenly w-full`}>
      {letters?.map((letter, idx) => (
        <Square key={letter + idx} letter={letter} />
      ))}
    </div>
  );
};

export default App;
