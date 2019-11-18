import React, { useState } from "react";
import styled from "@emotion/styled";
import { AppState } from "store";
import { useSelector, useDispatch } from "react-redux";
import { appConfig } from "clueapp/config";
import { request } from "clueapp/client";
import { Arrow, Clock2 } from "components/icons";
import {
  setResponseMessage,
  setRoomGuessField,
  setObjectGuessField,
  setGuestGuessField,
  moveBetweenRooms,
  exchangeItemInRoom,
  rotateSuspect
} from "store/clue/actions";
import { writeLog, setCriticalError } from "store/log/actions";
import { Guess } from "store/clue/types";
import {
  RoomId,
  FloorPlan,
  RoomData,
  PositionControllerProps,
  Directions,
  RoomNavigationDirections
} from "clueapp/gameboard";
import { SingleLogDisplay } from "components/log";
import { LogLevel } from "store/log/types";
import { Folder, FolderProps, FrontPageTab } from "./Folder";
import { randomElement } from "./RandomGuess";

type PowerBuffer = {
  content: string;
};
const bufferLimit = 4;
const updatePower = (content: string, char: string): string => {
  let str = content + char;
  if (str.length > bufferLimit) {
    return str.substr(str.length - bufferLimit, str.length);
  }
  return str;
};
export const PositionController = (props: PositionControllerProps) => {
  const dispatch = useDispatch();

  const powerBuffer: PowerBuffer = {
    content: ""
  };
  const [power, changePower] = useState(powerBuffer);
  const activeRoom = useSelector((state: AppState) => state.top.guess.room);
  const { guestSuspects, roomSuspects, objectSuspects } = useSelector(
    (state: AppState) => state.top
  );
  const move = (direction: RoomNavigationDirections) => {
    const motionResult = moveBetweenRooms({
      dispatch,
      activeRoomName: activeRoom,
      floorPlan: props.floorPlan,
      direction
    });
    if (motionResult.error) {
      writeLog(dispatch, {
        message: motionResult.error,
        level: LogLevel.error
      });
    } else if (motionResult.msg) {
      writeLog(dispatch, {
        message: motionResult.msg,
        level: LogLevel.info
      });
    }
  };
  const guess = useSelector((state: AppState) => state.top.guess);
  const activeObject = useSelector((state: AppState) => state.top.guess.object);
  const exchangeItem = () => {
    exchangeItemInRoom({
      dispatch,
      activeRoomName: activeRoom,
      activeObjectName: activeObject,
      floorPlan: props.floorPlan
    });
  };
  const randomizeAll = () => {
    setObjectGuessField(dispatch, randomElement(objectSuspects));
    setGuestGuessField(dispatch, randomElement(guestSuspects));
    setRoomGuessField(dispatch, randomElement(roomSuspects));
  };
  const handleKeydown = (e: React.KeyboardEvent) => {
    changePower({
      ...power,
      ...{ content: updatePower(power.content, e.key) }
    });
    // console.log(power);
    // console.log(e.keyCode);
    switch (e.keyCode) {
      case 65:
      case 37:
        move(Directions.west);
        break;
      case 87:
      case 38:
        move(Directions.north);
        break;
      case 68:
      case 39:
        move(Directions.east);
        break;
      case 83:
      case 40:
        move(Directions.south);
        break;
      case 81: //q
        randomizeAll();
        break;
      case 69: //e
        exchangeItem();
        break;
      case 90: //z
        helpRotateSuspect(-1);
        break;
      case 88: //x
        helpRotateSuspect(1);
        break;
      case 32: //space
        submitGuess();
        break;
    }
    // logInfo(e.key);
  };
  const submitGuess = () => {
    const g = guessFromState(guess);
    request(
      "POST",
      `${appConfig.gameServerUrl}/guess`,
      g,
      (resp: GuessResponse) => {
        console.log(resp);
        setResponseMessage(dispatch, resp.Msg);
        writeLog(dispatch, {
          message: resp.Msg,
          level: LogLevel.error
        });
      },
      resp => {
        console.log("error here");
        console.log(resp);
        setCriticalError(dispatch, resp);
      }
    );
  };
  const helpRotateSuspect = (offset: number) => {
    rotateSuspect(dispatch, guess.guest, guestSuspects, offset);
  };
  return (
    <div>
      <PositionControllerGrid>
        <div
          className="controllerTextButton"
          onClick={() => {
            randomizeAll();
            writeLog(dispatch, {
              message: "randomized the hypothesis",
              level: LogLevel.debug
            });
          }}
        >
          Randomize All
        </div>
        <div onClick={() => move(Directions.north)}>
          <div>
            <Arrow width={20} dir="up" />
          </div>
        </div>
        <div className="controllerTextButton" onClick={() => exchangeItem()}>
          Exchange Item
        </div>
        <div onClick={() => move(Directions.west)}>
          <div>
            <Arrow width={20} dir="left" />
          </div>
        </div>
        <div className="controllerTextButton" onClick={() => submitGuess()}>
          Submit Guess
        </div>
        <div onClick={() => move(Directions.east)}>
          <div>
            <Arrow width={20} dir="right" />
          </div>
        </div>
        <div
          className="controllerTextButton"
          onClick={() => helpRotateSuspect(-1)}
        >
          Prior Suspect
        </div>
        <div onClick={() => move(Directions.south)}>
          <div>
            <Arrow width={20} dir="down" />
          </div>
        </div>
        <div
          className="controllerTextButton"
          onClick={() => helpRotateSuspect(1)}
        >
          Next Suspect
        </div>
        <div></div>
        <div style={{ justifyContent: "center" }}>
          <input
            className="controllerInputField"
            type="text"
            onKeyDown={handleKeydown}
          />
        </div>
        <div></div>
      </PositionControllerGrid>
    </div>
  );
};

const PositionControllerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 2fr 2fr 2fr 1fr;
  width: 20vw;
`;

const guessFromState = (g: Guess) => {
  return { guess: g };
};
type GuessResponse = {
  Msg: string;
};
