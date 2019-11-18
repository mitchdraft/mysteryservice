export enum LogAction {
  WRITE_LOG = "WRITE_LOG",
  SET_CRITICAL_ERROR = "SET_CRITICAL_ERROR"
}

export enum LogLevel {
  debug = "DEBUG",
  info = "INFO",
  warning = "WARNING",
  error = "ERROR"
}
export type Log = {
  message: string;
  level: LogLevel;
  //todo: add flare
};
export interface WriteLogAction {
  type: typeof LogAction.WRITE_LOG;
  log: Log;
}

export interface SetCriticalErrorAction {
  type: typeof LogAction.SET_CRITICAL_ERROR;
  msg: string;
}

export type LogActionTypes = WriteLogAction | SetCriticalErrorAction;
