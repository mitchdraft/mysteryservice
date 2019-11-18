import { Dispatch } from "react";
import { WriteLogAction, LogAction, Log } from "./types";

export const writeLog = (dispatch: Dispatch<WriteLogAction>, log: Log) => {
  dispatch({
    type: LogAction.WRITE_LOG,
    log: log
  });
};
