export type RoomId = string | null;
export type ItemId = string | null;
export type RoomData = {
  name: RoomId;
  itemId?: ItemId;
  north?: RoomData;
  south?: RoomData;
  east?: RoomData;
  west?: RoomData;
  x: number;
  y: number;
};
export type FloorPlan = {
  rooms: Map<RoomId, RoomData>;
  positionMap: Map<string, RoomData>;
  layout: RoomId[][];
};
// TODO - store room neighbors in a map, use these as keys
export enum Directions {
  north = "NORTH",
  south = "SOUTH",
  east = "EAST",
  west = "WEST"
}
export type RoomNavigationDirections =
  | Directions.north
  | Directions.south
  | Directions.east
  | Directions.west;

export type PositionControllerProps = {
  floorPlan: FloorPlan;
};
