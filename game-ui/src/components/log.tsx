import React from "react";
import { AppState } from "store";
import { useSelector } from "react-redux";
import { LogLevel } from "store/log/types";

export type LogDisplayProps = {};
export const LogDisplay = () => {
  const logs = useSelector((state: AppState) => state.logs.logs);
  return (
    <>
      {logs.map((log, i) => (
        <div key={i}>{log.message}</div>
      ))}
    </>
  );
};

export type SingleLogDisplayProps = {};
export const SingleLogDisplay = (props: SingleLogDisplayProps) => {
  const logs = useSelector((state: AppState) => state.logs.logs);
  const initialLog = {
    message: "no logs",
    type: LogLevel.info
  };
  const log = logs.length > 0 ? logs[logs.length - 1] : initialLog;
  return <div>{log.message}</div>;
};
