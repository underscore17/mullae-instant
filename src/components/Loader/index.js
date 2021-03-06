import React, { useEffect, useReducer, useContext } from "react";
import styled from "styled-components";
import { AppContext } from "@components/Context";
import Apple from "./apple.svg";

export function getText(value) {
  switch (true) {
    case value < 3: {
      return "About an hour remaining";
    }
    case value <= 5.2: {
      return "Installation is in progress. Calculating time remaining...";
    }
    case value <= 6: {
      return "About an hour remaining";
    }
    default: {
      const remainMin = Math.ceil(((100 - value) * 2.5 * 2.4) / 60);
      return `About ${remainMin} minutes remaining`;
    }
  }
}

export const initialState = {
  value: 0,
  hint: "About an hour remaining",
};
export const progressReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case "NEXT": {
      const nextValue = state.value + 1;
      return {
        value: nextValue,
        hint: getText(nextValue),
      };
    }
    case "CLEAR": {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

const Loader = ({ className, initState }) => {
  const [progress, dispatch] = useReducer(progressReducer, initState);
  function next() {
    dispatch({ type: "NEXT" });
  }
  const {
    clickDown: [, setClockDown],
  } = useContext(AppContext);
  useEffect(() => {
    let timer;
    if (progress.value <= 100) {
      timer = setTimeout(next, 5);
    } else {
      setClockDown(true);
      clearTimeout(timer);
    }
    return () => {
      clearTimeout(timer);
    };
  });
  return (
    <div className={className}>
      <div className="content">
        <div className="logo">
          <Apple width={0} height={0} />
        </div>
        <div className="progress">
          <div className="bar" style={{ width: `${progress.value}%` }} />
        </div>
        <span className="hint">{progress.hint}</span>
      </div>
    </div>
  );
};

Loader.defaultProps = {
  initState: initialState,
};

export default styled(Loader)`
  @import url('https://fonts.googleapis.com/css?family=Roboto:300');
  himport { AppContext } from '@components/Context';
eight: 100%;
  background: "#2c3e50";
  cursor: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: roboto;
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .logo {
    height: 150px;
    width: 150px;
    margin: 120px 0 180px 0;
  }
  .hint {
    font-weight: 700;
    font-size: 1.1em;
    color: white;
  }
  .progress {
    border: 1px solid rgba(240, 240, 240, 0.1);
    border-radius: 5px;
    height: 8px;
    width: 360px;
    margin-bottom: 30px;
    background: rgb(30, 30, 30);
    position: relative;
    overflow: hidden;
  }
  .bar {
    position: absolute;
    width: 0;
    height: 100%;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    background: rgba(240, 240, 240, 0.9);
  }
`;
