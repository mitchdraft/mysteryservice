import React, { useState } from "react";
import styled from "@emotion/styled";
import { AppState } from "store";
import { useSelector, useDispatch } from "react-redux";
import { PositionController } from "clueapp/PositionController";
import { appConfig } from "clueapp/config";
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
import { RoomId, FloorPlan, RoomData } from "clueapp/gameboard";
import { SingleLogDisplay } from "components/log";
import { Folder, FolderProps, FrontPageTab } from "./Folder";

export const Initialize = () => {
  const { roomSuspects, objectSuspects } = useSelector(
    (state: AppState) => state.top
  );
  const floorPlan = newFloorPlan(4, 4, roomSuspects, objectSuspects);
  return floorPlan;
};

export type ClueAppProps = {};

export const ClueApp = (props: ClueAppProps) => {
  const fp = Initialize();
  const dispatch = useDispatch();
  const appTopState = useSelector((state: AppState) => state.top);
  const { guestSuspects, roomSuspects, objectSuspects } = useSelector(
    (state: AppState) => state.top
  );

  const FolderData: FolderProps = {
    tabs: [
      {
        list: [],
        name: "Guess",
        alternateComponent: <FrontPageTab />
      },
      {
        list: guestSuspects,
        name: "Guest",
        onRowClick: setGuestGuessField,
        dispatch: dispatch,
        highlightAsActiveGuess: (guestName: string): boolean =>
          guestName === appTopState.guess.guest
      },
      {
        list: roomSuspects,
        name: "Location",
        onRowClick: setRoomGuessField,
        dispatch: dispatch,
        highlightAsActiveGuess: (guestName: string): boolean =>
          guestName === appTopState.guess.room
      },
      {
        list: objectSuspects,
        name: "Item",
        onRowClick: setObjectGuessField,
        dispatch: dispatch,
        highlightAsActiveGuess: (guestName: string): boolean =>
          guestName === appTopState.guess.object
      }
    ],
    activeTab: 0
  };

  return (
    <MainLayout>
      <LhsLayout>
        <Folder {...FolderData} />
        <SingleLogDisplay />
        <PositionController floorPlan={fp} />
      </LhsLayout>
      <RenderFloorPlan floorPlan={fp} />
      <RiskyStuff />
    </MainLayout>
  );
};

const MainLayout = styled.div`
  display: grid;
  grid-gap: 1em;
  padding: 1em;
  grid-template-columns: 1fr 1fr;
  height: 80vh;
`;
const LhsLayout = styled.div`
  display: grid;
  grid-gap: 1em;
  padding: 1em;
  grid-template-rows: 6fr 1fr 6fr;
  height: 60vh;
`;
const PositionControllerBoundary = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 7vh;
`;

const getRoomPositionKeyFromRoom = (r: RoomData | null): string | null => {
  if (r) {
    return getRoomPositionKeyValues(r.x, r.y);
  }
  return null;
};
const getRoomPositionKeyValues = (x: number, y: number): string => {
  return `${x},${y}`;
};
const newFloorPlan = (
  width: number,
  height: number,
  roomNames: string[],
  objectSuspects: string[]
): FloorPlan => {
  const rooms = new Map<RoomId, RoomData>();
  const positionMap = new Map<string, RoomData>();
  const layout: RoomId[][] = [];
  let roomIndex = 0;
  for (let i = 0; i < width; i++) {
    const row: RoomId[] = [];
    for (let j = 0; j < height; j++) {
      if (roomIndex < roomNames.length) {
        const roomName = roomNames[roomIndex];
        row.push(roomName);
        const room = {
          name: roomName,
          x: j,
          y: i,
          itemId:
            roomIndex < objectSuspects.length ? objectSuspects[roomIndex] : ""
        };
        rooms.set(roomName, room);
        const roomPosKey = getRoomPositionKeyFromRoom(room);
        if (roomPosKey) {
          positionMap.set(roomPosKey, room);
        }
      } else {
        row.push(null);
      }
      roomIndex++;
    }
    layout.push(row);
  }
  const neighbor = (m: Map<string, RoomData>, x: number, y: number) => {
    const key = getRoomPositionKeyValues(x, y);
    return m.get(key);
  };
  rooms.forEach(rData => {
    if (!rData) {
      return;
    }
    // note that the origin is on the top-left of the screen so north is y-1
    rData.north = neighbor(positionMap, rData.x, rData.y - 1);
    rData.south = neighbor(positionMap, rData.x, rData.y + 1);
    rData.east = neighbor(positionMap, rData.x + 1, rData.y);
    rData.west = neighbor(positionMap, rData.x - 1, rData.y);
  });
  console.log(rooms);
  console.log(positionMap);
  return {
    rooms,
    positionMap,
    layout
  };
};

const FloorGrid =
  //todo - make parametric
  styled.div`
    height: 80vh;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
  `;

/*
if you leave the room under the failure conditions without having identified the failure, you "die" and get kicked outside
some rooms have phones in them, you can go there and "call a tap"
you can use this info to gather clues and build a case
*/
const RoomDiv = styled.div`
  outline: 1px solid black;
`;
interface RoomDiv2Props {
  roomId: RoomId;
  roomData?: RoomData;
  isActiveRoom: boolean;
}
const classNames = {
  room: "room",
  roomActive: "roomActive",
  roomInactive: "roomInactive",
  nonExistent: "roomNonexistent"
};
const RoomDiv2 = (props: RoomDiv2Props) => {
  const dispatch = useDispatch();
  const guess = useSelector((state: AppState) => state.top.guess);
  const classList = [classNames.room];
  if (props.roomId) {
    if (props.isActiveRoom) {
      classList.push(classNames.roomActive);
    } else {
      classList.push(classNames.roomInactive);
    }
  } else {
    classList.push(classNames.nonExistent);
  }
  return (
    <div
      className={classList.join(" ")}
      onClick={() =>
        props.roomId ? setRoomGuessField(dispatch, props.roomId) : null
      }
    >
      <RoomSplit>
        <div>{props.roomId}</div>
        {props.roomId && props.isActiveRoom ? (
          <>
            <Suspect name={guess.guest} />
            <div className="activeItem">{guess.object}</div>
          </>
        ) : (
          <>
            <div />
            <div />
          </>
        )}
        <div className="inactiveItem">{getItemsDisplay(props.roomData)}</div>
      </RoomSplit>
    </div>
  );
};
const RoomSplit = styled.div`
  display: grid;
  grid-gap: 4px;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  justify-content: center;
`;
// Only works when suspects are colors
const Suspect = (props: { name: string }) => (
  <div className="suspectDiv" style={{ background: props.name }}>
    {props.name}
  </div>
);

const getItemsDisplay = (room?: RoomData): string => {
  if (!room) {
    return "";
  }
  return room.itemId ? room.itemId : "";
};

type RenderFloorPlanProps = {
  floorPlan: FloorPlan;
};
const RenderFloorPlan = (props: RenderFloorPlanProps) => {
  const activeRoom = useSelector((state: AppState) => state.top.guess.room);
  return (
    <React.Fragment>
      <FloorGrid>
        {props.floorPlan.layout.map((row: RoomId[], i: number) => (
          <React.Fragment key={i}>
            {row.map((room, j) => (
              <RoomDiv2
                key={j}
                roomId={room}
                roomData={props.floorPlan.rooms.get(room)}
                isActiveRoom={room === activeRoom}
              />
            ))}
          </React.Fragment>
        ))}
      </FloorGrid>
    </React.Fragment>
  );
};

const RiskyStuff = () => {
  const criticalErrorMessage = useSelector(
    (state: AppState) => state.logs.criticalErrorMessage
  );
  if (criticalErrorMessage !== "") {
    return (
      <div className="criticalError">
        <p>tap tap tap...</p>
        <p>page for the infrastructure team:</p>
        <p>{criticalErrorMessage}</p>
      </div>
    );
  }
  return null;
};
