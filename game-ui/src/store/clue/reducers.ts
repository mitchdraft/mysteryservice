import { TopActionTypes, TopAction, Guess } from "./types";

export interface TopState {
  someCount: number;
  guess: Guess;
  responseMsg: string;
  guestSuspects: string[];
  roomSuspects: string[];
  objectSuspects: string[];
}

const baseGuestSuspects = ["red", "blue", "purple"];
const baseRoomSuspects = [
  "entryway",
  "library",
  "kitchen",
  "den",
  "dinning room",
  "pantry",
  "bathroom",
  "office",
  "bedroom",
  "guest room",
  "trash room",
  "music room",
  "garden"
];
const baseObjectSuspects = [
  "service mesh",
  "gateway",
  "container repo",
  "server fire"
];
const initialState: TopState = {
  someCount: 0,
  guestSuspects: baseGuestSuspects,
  roomSuspects: baseRoomSuspects,
  objectSuspects: baseObjectSuspects,
  guess: {
    guest: baseGuestSuspects[0],
    room: baseRoomSuspects[0],
    object: baseObjectSuspects[0]
  },
  responseMsg: ""
};

export function topReducer(state = initialState, action: TopActionTypes) {
  switch (action.type) {
    case TopAction.INCREMENT_SOME_COUNT:
      console.log("incrementing top count");
      return {
        ...state,
        someCount: state.someCount + action.payload
      };
    case TopAction.SET_GUEST_GUESS:
      return {
        ...state,
        guess: { ...state.guess, guest: action.payload }
      };
    case TopAction.SET_ROOM_GUESS:
      return {
        ...state,
        guess: { ...state.guess, room: action.payload }
      };
    case TopAction.SET_OBJECT_GUESS:
      return {
        ...state,
        guess: { ...state.guess, object: action.payload }
      };
    case TopAction.SET_RESPONSE_MSG:
      return {
        ...state,
        responseMsg: action.payload
      };
    case TopAction.SET_GUEST_SUSPECTS:
      return {
        ...state,
        guestSuspects: action.payload
      };
    case TopAction.SET_ROOM_SUSPECTS:
      return {
        ...state,
        roomSuspects: action.payload
      };
    case TopAction.SET_OBJECT_SUSPECTS:
      return {
        ...state,
        objectSuspects: action.payload
      };
    default:
      return state;
  }
}
