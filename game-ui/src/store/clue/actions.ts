import { Dispatch } from "react";
import {
  TopAction,
  IncrementSomeCountAction,
  SetGuestGuessAction,
  SetObjectGuessAction,
  SetRoomGuessAction,
  SetResponseMsgAction,
  SetGuestSuspectsAction,
  SetRoomSuspectsAction,
  SetObjectSuspectsAction
} from "./types";
import {
  FloorPlan,
  RoomData,
  Directions,
  RoomNavigationDirections
} from "clueapp/gameboard";

export const incrementSomeCounter = (
  dispatch: Dispatch<IncrementSomeCountAction>,
  amount: number
) => {
  dispatch({
    type: TopAction.INCREMENT_SOME_COUNT,
    payload: amount
  });
};

export const setGuestSuspects = (
  dispatch: Dispatch<SetGuestSuspectsAction>,
  payload: string[]
) => {
  dispatch({
    type: TopAction.SET_GUEST_SUSPECTS,
    payload
  });
};
export const setRoomSuspects = (
  dispatch: Dispatch<SetRoomSuspectsAction>,
  payload: string[]
) => {
  dispatch({
    type: TopAction.SET_ROOM_SUSPECTS,
    payload
  });
};
export const setObjectSuspects = (
  dispatch: Dispatch<SetObjectSuspectsAction>,
  payload: string[]
) => {
  dispatch({
    type: TopAction.SET_OBJECT_SUSPECTS,
    payload
  });
};

export const setGuestGuessField = (
  dispatch: Dispatch<SetGuestGuessAction>,
  payload: string
) => {
  dispatch({
    type: TopAction.SET_GUEST_GUESS,
    payload
  });
};

export const setRoomGuessField = (
  dispatch: Dispatch<SetRoomGuessAction>,
  payload: string
) => {
  dispatch({
    type: TopAction.SET_ROOM_GUESS,
    payload
  });
};

export const setObjectGuessField = (
  dispatch: Dispatch<SetObjectGuessAction>,
  payload: string
) => {
  dispatch({
    type: TopAction.SET_OBJECT_GUESS,
    payload
  });
};

export const rotateSuspect = (
  dispatch: Dispatch<SetGuestGuessAction>,
  current: string,
  list: string[],
  offset: number
) => {
  // ensure that the new index is never negative
  const adjustedOffset = (offset % list.length) + list.length;
  const ind = list.findIndex(str => str === current);
  const newSuspect =
    ind > -1 ? list[(ind + adjustedOffset) % list.length] : current;
  dispatch({
    type: TopAction.SET_GUEST_GUESS,
    payload: newSuspect
  });
};

export const setResponseMessage = (
  dispatch: Dispatch<SetResponseMsgAction>,
  payload: string
) => {
  dispatch({
    type: TopAction.SET_RESPONSE_MSG,
    payload
  });
};

type moveActionType = {
  dispatch: Dispatch<SetRoomGuessAction>;
  floorPlan: FloorPlan;
  activeRoomName: string;
  direction: RoomNavigationDirections;
};
export type MotionResult = {
  error?: string;
  msg?: string;
};
export const moveBetweenRooms = (args: moveActionType): MotionResult => {
  const room = args.floorPlan.rooms.get(args.activeRoomName);
  if (!room) {
    console.error(`room ${args.activeRoomName} not found in map`);
    return { error: `room ${args.activeRoomName} not found in map` };
  }
  let nextRoom: RoomData | undefined;
  switch (args.direction) {
    case Directions.north:
      nextRoom = room.north;
      break;
    case Directions.south:
      nextRoom = room.south;
      break;
    case Directions.east:
      nextRoom = room.east;
      break;
    case Directions.west:
      nextRoom = room.west;
      break;
  }
  if (!nextRoom) {
    const msg = `you can't go that way (${args.direction})!`;
    console.log(msg);
    return { error: msg };
  }
  if (!nextRoom.name) {
    // should not happen
    const msg = `invalid conifg: no name given for active room`;
    console.error(msg);
    return { error: msg };
  }
  setRoomGuessField(args.dispatch, nextRoom.name);
  return { msg: `exploring the ${nextRoom.name}` };
};

type exchangeActionType = {
  dispatch: Dispatch<SetObjectGuessAction>;
  floorPlan: FloorPlan;
  activeRoomName: string;
  activeObjectName: string;
};
export const exchangeItemInRoom = (args: exchangeActionType) => {
  const room = args.floorPlan.rooms.get(args.activeRoomName);
  const roomItem = room && room.itemId ? room.itemId : "";
  // args.floorPlan.rooms.set(args.activeRoomName,args.activeObjectName)
  if (room) {
    // room.itemId = args.activeObjectName;
    // TODO - move room state to redux
    // args.floorPlan.rooms.set(args.activeRoomName, {
    //   ...room,
    //   itemId: args.activeObjectName
    // });
    setObjectGuessField(args.dispatch, roomItem);
  }
};
