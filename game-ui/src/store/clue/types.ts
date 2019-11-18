export enum TopAction {
  INCREMENT_SOME_COUNT = "INCREMENT_SOME_COUNT",
  SET_GUEST_GUESS = "SET_GUEST_GUESS",
  SET_ROOM_GUESS = "SET_ROOM_GUESS",
  SET_OBJECT_GUESS = "SET_OBJECT_GUESS",
  SET_RESPONSE_MSG = "SET_RESPONSE_MSG",
  SET_GUEST_SUSPECTS = "SET_GUEST_SUSPECTS",
  SET_ROOM_SUSPECTS = "SET_ROOM_SUSPECTS",
  SET_OBJECT_SUSPECTS = "SET_OBJECT_SUSPECTS"
}

export interface IncrementSomeCountAction {
  type: typeof TopAction.INCREMENT_SOME_COUNT;
  payload: number;
}

export interface SetGuestGuessAction {
  type: typeof TopAction.SET_GUEST_GUESS;
  payload: string;
}

export interface SetRoomGuessAction {
  type: typeof TopAction.SET_ROOM_GUESS;
  payload: string;
}

export interface SetObjectGuessAction {
  type: typeof TopAction.SET_OBJECT_GUESS;
  payload: string;
}

export interface SetResponseMsgAction {
  type: typeof TopAction.SET_RESPONSE_MSG;
  payload: string;
}

export interface SetGuestSuspectsAction {
  type: typeof TopAction.SET_GUEST_SUSPECTS;
  payload: string[];
}
export interface SetRoomSuspectsAction {
  type: typeof TopAction.SET_ROOM_SUSPECTS;
  payload: string[];
}
export interface SetObjectSuspectsAction {
  type: typeof TopAction.SET_OBJECT_SUSPECTS;
  payload: string[];
}

export type TopActionTypes =
  | IncrementSomeCountAction
  | SetGuestGuessAction
  | SetRoomGuessAction
  | SetObjectGuessAction
  | SetResponseMsgAction
  | SetGuestSuspectsAction
  | SetRoomSuspectsAction
  | SetObjectSuspectsAction;

export type Guess = {
  guest: string;
  room: string;
  object: string;
};
