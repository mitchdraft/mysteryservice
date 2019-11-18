import React, { useState, Dispatch } from "react";
import styled from "@emotion/styled";
import { TopActionTypes } from "store/clue/types";
import { useSelector } from "react-redux";
import { AppState } from "store";

export type TabProps = {
  rows: TabContent;
  active: boolean;
};
export type FrontPageTabProps = {};
export const FrontPageTab = (props: FrontPageTabProps) => {
  const {
    guess: { guest, room, object }
  } = useSelector((state: AppState) => state.top);
  const caseGuess = [`Guest: ${guest}`, `Location: ${room}`, `Item: ${object}`];
  return (
    <div className="tabContent">
      {caseGuess.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
};
export const Tab = (props: TabProps) => {
  if (!props.active) {
    return <></>;
  }
  if (props.rows.alternateComponent) {
    return props.rows.alternateComponent;
  }
  return (
    <div className="tabContent">
      {props.rows.list.map((row, i) => (
        <div
          key={i}
          className={
            "folderRow " +
            (props.rows.highlightAsActiveGuess &&
            props.rows.highlightAsActiveGuess(row)
              ? "folderRowActive"
              : "")
          }
          onClick={() => {
            if (props.rows.onRowClick && props.rows.dispatch) {
              props.rows.onRowClick(props.rows.dispatch, row);
            }
          }}
        >
          {i}: {row}
        </div>
      ))}
    </div>
  );
};
type TabHeaderProps = {
  id: number;
  active: boolean;
  name: string;
  onClick: () => void;
};
const TabHeader = (props: TabHeaderProps) => {
  return (
    <div
      className={"tabHeader " + (props.active ? "tabHeaderActive" : "")}
      key={props.id}
      onClick={props.onClick}
    >
      {/* <button > */}
      {props.name}
      {/* </button> */}
    </div>
  );
};

// A Folder has tabs, only one tab is active at a time
export type FolderProps = {
  tabs: TabContent[];
  activeTab?: number;
};
export type TabContent = {
  list: string[];
  name?: string;
  highlightAsActiveGuess?: (name: string) => boolean;
  onRowClick?: (d: Dispatch<TopActionTypes>, s: string) => void;
  dispatch?: Dispatch<TopActionTypes>;
  alternateComponent?: JSX.Element;
};
export const Folder = (props: FolderProps) => {
  const st = {
    activeTab: 0
  };
  const [state, updateState] = useState(st);
  const tabSelect = (props: { name: string; id: number; active: boolean }) => (
    <TabHeader
      key={props.id}
      id={props.id}
      active={props.active}
      name={props.name}
      onClick={() => {
        updateState({
          ...state,
          ...{ activeTab: props.id }
        });
        console.log(state.activeTab);
      }}
    />
  );
  return (
    <div className="detectiveFolder">
      <TabHolder>
        {props.tabs.map((tab, i) =>
          tabSelect({
            name: tab.name || `${i}`,
            id: i,
            active: i === state.activeTab
          })
        )}
      </TabHolder>
      {props.tabs.map((tab, i) => (
        <Tab
          key={i}
          {...{
            rows: tab,
            active: i === state.activeTab
          }}
        />
      ))}
    </div>
  );
};

const TabHolder = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  background: none;
`;
