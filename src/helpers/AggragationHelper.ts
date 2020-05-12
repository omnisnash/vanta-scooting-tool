import { ReferencialType, ReferentialPerValue } from "../models/Config";
import { MeasureGroup, LOD } from "./../models/GroupedData";
import {
  AggregatedMeasureGroup,
  AggregatedConcentration,
} from "./../models/AggregatedData";
import AppConfiguration from "../models/Config";
import GroupedData from "../models/GroupedData";
import AggregatedData from "../models/AggregatedData";

interface ReferentialComputation {
  closeToNextReferential: boolean;
  associatedReferential?: ReferencialType;
}

function computeReferential(
  value: number,
  elementReferential: ReferentialPerValue,
  incertitude = 0
): ReferentialComputation {
  const valueWithIncertitude = value + value * incertitude;

  let associatedReferential: ReferencialType | undefined;
  let closeToNextReferential = false;

  if (value < elementReferential.A) {
    associatedReferential = undefined;
  } else if (value < elementReferential.B) {
    associatedReferential = ReferencialType.A;
    closeToNextReferential = valueWithIncertitude >= elementReferential.B;
  } else if (value < elementReferential.C) {
    associatedReferential = ReferencialType.B;
    closeToNextReferential = valueWithIncertitude >= elementReferential.C;
  } else if (value < elementReferential.D) {
    associatedReferential = ReferencialType.C;
    closeToNextReferential = valueWithIncertitude >= elementReferential.D;
  } else {
    associatedReferential = ReferencialType.D;
  }

  return { associatedReferential, closeToNextReferential };
}

function aggregateGroup(
  group: MeasureGroup,
  appConfiguration: AppConfiguration,
  useErrorForReferential = true
): AggregatedMeasureGroup {
  const elementPerConcentration = new Map<string, number[]>();
  const elementPerErrors = new Map<string, number[]>();
  const elementPerIgnoredConcentration = new Map<string, number[]>();
  const elementPerIgnoredErrors = new Map<string, number[]>();

  let usedMeasureCount = 0;
  let date = new Date();

  const getOrDefault = (map: Map<string, number[]>, key: string): number[] => {
    let value = map.get(key);

    if (!value) {
      value = [];
      map.set(key, value);
    }

    return value;
  };

  // Retrieve all mesures/errors for each elements (need ofr standard deviation)
  for (const measure of group.measures) {
    for (const concentration of measure.concentrations) {
      const element = concentration.element;

      // <LOD values are ignored / measure is ignored. But if we only have <LOD values, we want the average error
      // FIXME: if no values / all ignored?
      if (concentration.value === LOD || measure.ignored) {
        getOrDefault(elementPerIgnoredConcentration, element).push(
          concentration.value
        );
        getOrDefault(elementPerIgnoredErrors, element).push(
          concentration.error
        );
      } else {
        getOrDefault(elementPerConcentration, element).push(
          concentration.value
        );
        getOrDefault(elementPerErrors, element).push(concentration.error);
      }
    }

    usedMeasureCount += measure.ignored ? 0 : 1;
    date = measure.date;
  }

  // Generate AggregatedConcentration for each available elements
  const availableElements = [
    ...new Set([
      ...elementPerConcentration.keys(),
      ...elementPerIgnoredConcentration.keys(),
    ]),
  ];
  const concentrations: AggregatedConcentration[] = [];

  for (const element of availableElements) {
    const aggregatedConcentration: AggregatedConcentration = {
      element: element,
      closeToNextReferential: false,
      error: -1,
      value: -1,
      errorStandardDeviation: -1,
    };

    const concentrationValues = elementPerConcentration.get(element);
    const errorValues = elementPerErrors.get(element);

    if (!concentrationValues || !errorValues) {
      const ignoredErrorValues = elementPerIgnoredErrors.get(element);
      // All measures return <LOD
      aggregatedConcentration.value = LOD;
      aggregatedConcentration.error = ignoredErrorValues
        ? ignoredErrorValues.reduce(
            (accumulator, value) => accumulator + value,
            0
          ) / ignoredErrorValues.length
        : 0;
      aggregatedConcentration.errorStandardDeviation = 0;
    } else {
      // Average + standard deviation computation
      aggregatedConcentration.value =
        concentrationValues.reduce(
          (accumulator, value) => accumulator + value,
          0
        ) / concentrationValues.length;
      aggregatedConcentration.error =
        errorValues.reduce((accumulator, value) => accumulator + value, 0) /
        concentrationValues.length;
      aggregatedConcentration.errorStandardDeviation = Math.sqrt(
        concentrationValues.reduce(
          (accumulator, value) =>
            Math.pow(value - aggregatedConcentration.value, 2) + accumulator,
          0
        ) / concentrationValues.length
      );

      // Cumpute referential information
      const elementReferential = appConfiguration.getReferencialForElement(
        element
      );

      if (elementReferential) {
        const incertitude = appConfiguration.referencials.incertitude;
        const concentration = useErrorForReferential
          ? aggregatedConcentration.value + aggregatedConcentration.error
          : aggregatedConcentration.value;
        const refentialInfo = computeReferential(
          concentration,
          elementReferential,
          incertitude
        );

        aggregatedConcentration.closeToNextReferential =
          refentialInfo.closeToNextReferential;
        aggregatedConcentration.associatedReferential =
          refentialInfo.associatedReferential;
      }
    }

    concentrations.push(aggregatedConcentration);
  }

  return {
    id: group.name,
    concentrations: concentrations,
    date: date,
    measureCount: usedMeasureCount,
  };
}

export default function getAggregatedData(
  groupedData: GroupedData,
  appConfiguration: AppConfiguration,
  useErrorForReferential = true
): AggregatedData {
  const operators = new Set<string>();
  const projects = new Set<string>();
  const elements = new Set<string>();
  const aggregatedGroups: AggregatedMeasureGroup[] = [];

  for (const group of groupedData.measuresGroups) {
    group.measures.forEach((measure) => {
      operators.add(measure.operator);
      projects.add(measure.project);
      measure.concentrations.forEach((concentration) =>
        elements.add(concentration.element)
      );
    });

    aggregatedGroups.push(
      aggregateGroup(group, appConfiguration, useErrorForReferential)
    );
  }

  return {
    name: groupedData.name,
    aggregatedgroups: aggregatedGroups,
    operators: [...operators],
    projects: [...projects],
    elements: [...elements],
  };
}
