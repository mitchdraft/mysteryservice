import React, { useState, ReactChildren, ReactChild, ReactNode } from "react";
import styled from "@emotion/styled";
import { AppState } from "store";
import { useSelector, useDispatch } from "react-redux";
import {
  setResponseMessage,
  setRoomGuessField,
  setObjectGuessField,
  setGuestGuessField,
  moveBetweenRooms,
  exchangeItemInRoom
} from "store/clue/actions";
import { writeLog } from "store/log/actions";
import { Guess } from "store/clue/types";
import {
  RoomId,
  FloorPlan,
  RoomData,
  PositionControllerProps,
  Directions,
  RoomNavigationDirections
} from "clueapp/gameboard";
import { LogDisplay, SingleLogDisplay } from "components/log";
import { LogLevel } from "store/log/types";
import { Folder, FolderProps } from "./Folder";
import { Clock1, Clock2 } from "components/icons";

export const Lister = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

export const SimpleSuspectList = (props: {
  roomSuspects: string[];
  guestSuspects: string[];
  objectSuspects: string[];
}) => {
  const { guestSuspects, roomSuspects, objectSuspects } = props;
  return (
    <Lister>
      <ListGuests {...{ guestSuspects }} />
      <ListRooms {...{ roomSuspects }} />
      <ListObjects {...{ objectSuspects }} />
    </Lister>
  );
};

export const ListRooms = (props: { roomSuspects: string[] }) => {
  const dispatch = useDispatch();
  const activeRoom = useSelector((state: AppState) => state.top.guess.room);
  return (
    <div>
      {props.roomSuspects.map(r => (
        <div
          key={r}
          onClick={() => {
            setRoomGuessField(dispatch, r);
          }}
          style={{ background: r === activeRoom ? "red" : "grey" }}
        >
          {r}
        </div>
      ))}
    </div>
  );
};
export const ListGuests = (props: { guestSuspects: string[] }) => {
  const dispatch = useDispatch();
  const activeGuest = useSelector((state: AppState) => state.top.guess.guest);
  return (
    <div>
      {props.guestSuspects.map(r => (
        <div
          key={r}
          onClick={() => {
            setGuestGuessField(dispatch, r);
          }}
          style={{ background: r === activeGuest ? "red" : "grey" }}
        >
          {r}
        </div>
      ))}
    </div>
  );
};

export const ListObjects = (props: { objectSuspects: string[] }) => {
  const dispatch = useDispatch();
  const activeObject = useSelector((state: AppState) => state.top.guess.object);
  return (
    <div>
      {props.objectSuspects.map(r => (
        <div
          key={r}
          onClick={() => {
            setObjectGuessField(dispatch, r);
          }}
          style={{ background: r === activeObject ? "red" : "grey" }}
        >
          {r}
        </div>
      ))}
    </div>
  );
};
