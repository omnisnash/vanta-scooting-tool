import { Concentration } from "./GroupedData";
import { ReferencialType } from "./Config";

export default interface AggregatedData {
  name: string;
  projects: string[];
  operators: string[];
  aggregatedgroups: AggregatedMeasureGroup[];
  elements: string[];
}

export interface AggregatedMeasureGroup {
  id: string;
  date: Date;
  measureCount: number;
  concentrations: AggregatedConcentration[];
}

export interface AggregatedConcentration extends Concentration {
  errorStandardDeviation: number;
  closeToNextReferential: boolean;
  associatedReferential?: ReferencialType;
}
