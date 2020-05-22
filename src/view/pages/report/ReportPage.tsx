import React, { Component } from "react";
import "./ReportPage.css";
import AggregatedData from "../../../models/AggregatedData";
import AppConfiguration, { ReferentialPerValue } from "../../../models/Config";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GroupedData from "../../../models/GroupedData";
import getAggregatedData from "../../../helpers/AggragationHelper";

interface ReportPageProps {
  onUseErrorForReferencial: () => void;
  onUseConditionnalFormatting: () => void;
  groupedData?: GroupedData;
  appConfiguration: AppConfiguration;
  useErrorForReferential?: boolean;
  displayConditionnalFormatting?: boolean;
}

interface ReportPageStates {}

class ReportPage extends Component<ReportPageProps, ReportPageStates> {
  constructor(props: ReportPageProps) {
    super(props);

    this.state = {};
  }

  render() {
    if (!this.props.groupedData) {
      return (
        <p>
          <strong>Vous devez d'abord importer des mesures.</strong>
        </p>
      );
    }

    const aggregatedData = getAggregatedData(
      this.props.groupedData,
      this.props.appConfiguration,
      this.props.useErrorForReferential
    );

    const groupHeader = aggregatedData.aggregatedgroups.map((group) => {
      return (
        <th rowSpan={2} key={group.id}>
          <div></div>
          {group.id}
        </th>
      );
    });

    const groupMeasureCount = aggregatedData.aggregatedgroups.map((group) => (
      <td key={group.id}>{group.measureCount}</td>
    ));

    const measuresRows = aggregatedData.elements.map((element) => {
      return (
        <tr key={element}>
          <th>
            {element}
            <br />
            <ReferencialValuesTd
              values={this.props.appConfiguration.getReferencialForElement(
                element
              )}
            />
          </th>
          <ElementPerGroupTd
            aggregatedData={aggregatedData}
            element={element}
            displayConditionnalFormatting={this.props.displayConditionnalFormatting}
          />
        </tr>
      );
    });

    const useErrorForReferential = this.props.useErrorForReferential;
    const useConditionnalFormatting = this.props.displayConditionnalFormatting;

    return (
      <div className="report-container">
        <div className="report-header">
          <div className="report-title">
            <h1 className="title">{aggregatedData.name}</h1>
            <h2 className="subtitle project-info is-small">
              <div className="field is-grouped is-grouped-multiline">
                <div className="control">
                  <div className="tags has-addons">
                    <span className="tag is-dark">Project(s)</span>
                    <span className="tag is-light">
                      {aggregatedData.projects.join(" | ")}
                    </span>
                  </div>
                </div>

                <div className="control">
                  <div className="tags has-addons">
                    <span className="tag is-dark">Operator(s)</span>
                    <span className="tag is-light">
                      {aggregatedData.operators.join(" | ")}
                    </span>
                  </div>
                </div>
              </div>
            </h2>
          </div>

          <div className="report-buttons">
          <button
              className={
                "button is-medium " +
                (useConditionnalFormatting ? "is-link" : "is-outlined")
              }
              onClick={this.props.onUseConditionnalFormatting}
            >
              <span className="icon is-small">
                <FontAwesomeIcon
                  icon={useConditionnalFormatting ? faToggleOn : faToggleOff}
                />
              </span>
              <span>Coloration</span>
            </button>
            <button
              className={
                "button is-medium " +
                (useErrorForReferential ? "is-link" : "is-outlined")
              }
              onClick={this.props.onUseErrorForReferencial}
              disabled={!useConditionnalFormatting}
            >
              <span className="icon is-small">
                <FontAwesomeIcon
                  icon={useErrorForReferential ? faToggleOn : faToggleOff}
                />
              </span>
              <span>Utliser l'erreur</span>
            </button>
          </div>
        </div>

        <div className={"report-table-container"}>
          <table className="table is-bordered is-fullwidth">
            <thead>
              <tr>
                <th></th>
                {groupHeader}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Nombre de mesures</th>
                {groupMeasureCount}
              </tr>
              {measuresRows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function ReferencialValuesTd(props: { values?: ReferentialPerValue | null }) {
  return (
    <div className="referential-container">
      <span data-refential="A" className="referential-item">
        {props.values?.A || "-"}
      </span>
      <span data-refential="B" className="referential-item">
        {props.values?.B || "-"}
      </span>
      <span data-refential="C" className="referential-item">
        {props.values?.C || "-"}
      </span>
      <span data-refential="D" className="referential-item">
        {props.values?.D || "-"}
      </span>
    </div>
  );
}

function ElementPerGroupTd(props: {
  aggregatedData: AggregatedData;
  element: string;
  displayConditionnalFormatting?: boolean;
}) {
  const measurePerGroup = props.aggregatedData.aggregatedgroups.map((group) => {
    const concentration = group.concentrations.find(
      (concentration) => concentration.element === props.element
    );
    const value =
      concentration?.value === -1
        ? "<LOD"
        : Math.round(concentration?.value || 0);
    const style = concentration?.value === -1 ? "lod" : "";
    const error = concentration?.error ? Math.round(concentration?.error) : "-";
    const deviation = concentration?.errorStandardDeviation
      ? Math.round(concentration?.errorStandardDeviation)
      : "-";

    return (
      <td
        key={group.id}
        className={
          concentration?.closeToNextReferential && props.displayConditionnalFormatting
            ? "is-near-next-referential"
            : ""
        }
        data-referential={props.displayConditionnalFormatting && concentration?.associatedReferential}
      >
        <b>
          <span className={style}>{value}</span>
        </b>
        <br />
        <span className="concentration-info">
          {error} | {deviation}
        </span>
      </td>
    );
  });

  return <React.Fragment>{measurePerGroup}</React.Fragment>;
}

export default ReportPage;
