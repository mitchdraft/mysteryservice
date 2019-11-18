import { Dispatch } from "react";
import {
  WriteLogAction,
  LogAction,
  Log,
  SetCriticalErrorAction
} from "./types";

export const writeLog = (dispatch: Dispatch<WriteLogAction>, log: Log) => {
  dispatch({
    type: LogAction.WRITE_LOG,
    log: log
  });
};

export const setCriticalError = (
  dispatch: Dispatch<SetCriticalErrorAction>,
  msg: string
) => {
  dispatch({
    type: LogAction.SET_CRITICAL_ERROR,
    msg
  });
};
