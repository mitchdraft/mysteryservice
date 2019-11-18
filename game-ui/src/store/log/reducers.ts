import { Log, LogActionTypes, LogAction } from "./types";

export interface LogState {
  logs: Log[];
}

const initialState: LogState = {
  logs: []
};

export function logsReducer(state = initialState, action: LogActionTypes) {
  switch (action.type) {
    case LogAction.WRITE_LOG:
      return {
        ...state,
        logs: [...state.logs, action.log]
      };
    default:
      return state;
  }
}
