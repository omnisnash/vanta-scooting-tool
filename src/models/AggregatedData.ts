import { Concentration } from './GroupedData';
import { ReferencialType } from './Config';

export default interface AggregatedData {
  projects: string[];
  operators: string[];
  aggregatedgroups: AggregatedMeasureGoup[];
}

export interface AggregatedMeasureGoup {
  id: string;
  date: Date;
  measureCount: number;
  concentrations: AggregatedConcentration;
}

export interface AggregatedConcentration extends Concentration {
  errorStandardDerivation: number;
  closeToNextReferential: boolean;
  associatedReferential: ReferencialType;
}
