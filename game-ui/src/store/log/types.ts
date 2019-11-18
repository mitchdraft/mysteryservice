export enum LogAction {
  WRITE_LOG = "WRITE_LOG"
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

export type LogActionTypes = WriteLogAction;
