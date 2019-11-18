import React from "react";
import styled from "@emotion/styled";
import { AppState } from "store";
import {
  setRoomGuessField,
  setObjectGuessField,
  setGuestGuessField
} from "store/clue/actions";
import { useSelector, useDispatch } from "react-redux";

export const RandomizeGuess = () => {
  const { guestSuspects, roomSuspects, objectSuspects } = useSelector(
    (state: AppState) => state.top
  );
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <RandomizerDiv>
        <div>Randomize</div>
        <RandomizerLayout>
          <button
            onClick={() => {
              setGuestGuessField(dispatch, randomElement(guestSuspects));
            }}
          >
            Guest
          </button>
          <button
            onClick={() => {
              setRoomGuessField(dispatch, randomElement(roomSuspects));
            }}
          >
            Room
          </button>
          <button
            onClick={() => {
              setObjectGuessField(dispatch, randomElement(objectSuspects));
            }}
          >
            Object
          </button>
          <button
            onClick={() => {
              setObjectGuessField(dispatch, randomElement(objectSuspects));
              setGuestGuessField(dispatch, randomElement(guestSuspects));
              setRoomGuessField(dispatch, randomElement(roomSuspects));
            }}
          >
            All
          </button>
        </RandomizerLayout>
      </RandomizerDiv>
    </React.Fragment>
  );
};

const RandomizerLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

const RandomizerDiv = styled.div`
  background: grey;
  width: min-content;
`;
export const randomElement = (arr: string[]): string => {
  return arr[Math.floor(Math.random() * arr.length)];
};
