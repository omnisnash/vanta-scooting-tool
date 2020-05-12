export const LOD = -1;

export default interface GroupedData {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
  measuresGroups: MeasureGroup[];
}

export interface MeasureGroup {
  name: string;
  measures: Measure[];
}

export interface Measure {
  id: number;
  date: Date;
  units: String;
  methodName: string;
  elevation: number;
  position: Position;
  concentrations: Concentration[];
  operator: string;
  project: string;
  group: string;
  ignored?: boolean;
}

export interface Position {
  lon: number;
  lat: number;
}

export interface Concentration {
  element: string;
  value: number;
  error: number;
}
