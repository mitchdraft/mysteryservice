import { Log, LogActionTypes, LogAction } from "./types";

export interface LogState {
  logs: Log[];
  criticalErrorMessage: string;
}

const initialState: LogState = {
  logs: [],
  criticalErrorMessage: ""
};

export function logsReducer(state = initialState, action: LogActionTypes) {
  switch (action.type) {
    case LogAction.WRITE_LOG:
      return {
        ...state,
        logs: [...state.logs, action.log]
      };
    case LogAction.SET_CRITICAL_ERROR:
      return {
        ...state,
        criticalErrorMessage: action.msg
      };
    default:
      return state;
  }
}
