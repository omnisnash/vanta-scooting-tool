import React, { Component } from "react";
import "./ReportPage.css";
import AggregatedData from "../../../models/AggregatedData";
import AppConfiguration, { ReferentialPerValue } from "../../../models/Config";
import { faDownload, faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GroupedData from "../../../models/GroupedData";
import getAggregatedData from "../../../helpers/AggragationHelper";
import html2canvas from "html2canvas";
import {
  setScrollPosition,
  getStoredScrollPosition,
} from "../../../helpers/LocalStorageHelper";

const SCROLL_ID = "report-table";

interface ReportPageProps {
  onUseErrorForReferencial: () => void;
  onUseConditionnalFormatting: () => void;
  groupedData?: GroupedData;
  appConfiguration: AppConfiguration;
  useErrorForReferential?: boolean;
  displayConditionnalFormatting?: boolean;
}

enum ExportStatus {
  NONE,
  IN_PROGRESS,
  DONE,
  ERROR,
}

interface ReportPageStates {
  exportStatus: ExportStatus;
}

class ReportPage extends Component<ReportPageProps, ReportPageStates> {
  private exportResult: HTMLCanvasElement | undefined;

  constructor(props: ReportPageProps) {
    super(props);

    this.state = {
      exportStatus: ExportStatus.NONE,
    };
  }

  exportReportAsImage = () => {
    this.setState({ exportStatus: ExportStatus.IN_PROGRESS });
  };

  componentDidMount() {
    const tableContainer = document.getElementById("report-table-container");

    if (!tableContainer) {
      return;
    }

    const scrollPosition = getStoredScrollPosition(SCROLL_ID);

    if (!scrollPosition) {
      return;
    }

    tableContainer.scrollLeft = scrollPosition.left;
    tableContainer.scrollTop = scrollPosition.top;
  }

  componentWillUnmount() {
    const tableContainer = document.getElementById("report-table-container");

    if (!tableContainer) {
      return;
    }

    setScrollPosition(SCROLL_ID, {
      top: tableContainer.scrollTop,
      left: tableContainer.scrollLeft,
    });
  }

  componentDidUpdate() {
    // Handle table exportation
    if (this.state.exportStatus === ExportStatus.IN_PROGRESS) {
      const tableContainer = document.getElementById("report-table-container");
      const table = document.getElementById("report-table");

      // We need to set the scroll to 0, else a transparent white background appear on the exported image
      let containerScrollLeft: number, containerScrollTop: number;

      if (!tableContainer || !table) {
        this.setState({ exportStatus: ExportStatus.ERROR });
        console.error("Table or table container were not found.");
        return;
      }

      tableContainer.scrollTop = 0;
      tableContainer.scrollLeft = 0;

      html2canvas(table)
        .then((canvas) => {
          this.exportResult = canvas;

          tableContainer.scrollTop = containerScrollTop;
          tableContainer.scrollLeft = containerScrollLeft;

          this.setState({ exportStatus: ExportStatus.DONE });
        })
        .catch((error) => {
          console.error(error);
          this.setState({ exportStatus: ExportStatus.ERROR });
        });
    }
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
            displayConditionnalFormatting={
              this.props.displayConditionnalFormatting
            }
          />
        </tr>
      );
    });

    const useErrorForReferential = this.props.useErrorForReferential;
    const useConditionnalFormatting = this.props.displayConditionnalFormatting;

    return (
      <div className="report-container">
        {this.state.exportStatus !== ExportStatus.NONE && (
          <ExportModal
            onClose={() => this.setState({ exportStatus: ExportStatus.NONE })}
            canvas={this.exportResult}
            exportStatus={this.state.exportStatus}
            fileName={aggregatedData.name}
          />
        )}
        <div className="report-header">
          <div className="report-title">
            <h5 className="title is-5">{aggregatedData.name}</h5>
            <h6 className="subtitle project-info is-small">
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
            </h6>
          </div>

          <div className="report-buttons">
            <div className="field">
              <input
                id="conditionnalFormatting"
                type="checkbox"
                name="conditionnalFormatting"
                className="switch is-medium is-info"
                checked={useConditionnalFormatting}
                onClick={this.props.onUseConditionnalFormatting}
              />
              <label htmlFor="conditionnalFormatting">Coloration</label>
            </div>
            <div className="field">
              <input
                id="useError"
                type="checkbox"
                name="useError"
                className="switch is-medium is-info"
                checked={useErrorForReferential}
                disabled={!useConditionnalFormatting}
                onClick={this.props.onUseErrorForReferencial}
              />
              <label htmlFor="useError">Utiliser l'erreur</label>
            </div>

            <button
              className={"button is-medium"}
              onClick={this.exportReportAsImage}
            >
              <span className="icon is-small">
                <FontAwesomeIcon icon={faFileExport} />
              </span>
              <span>Exporter</span>
            </button>
          </div>
        </div>

        <div
          id={"report-table-container"}
          className={
            this.state.exportStatus === ExportStatus.NONE
              ? "enabled-sticky"
              : ""
          }
        >
          <table id="report-table" className="table is-bordered is-fullwidth">
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
          concentration?.closeToNextReferential &&
          props.displayConditionnalFormatting
            ? "is-near-next-referential"
            : ""
        }
        data-referential={
          props.displayConditionnalFormatting &&
          concentration?.associatedReferential
        }
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

interface ExportModalProps {
  onClose: () => void;
  canvas?: HTMLCanvasElement;
  exportStatus: ExportStatus;
  fileName: string;
}

function ExportModal(props: ExportModalProps) {
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Exporter le rapport</p>
        </header>
        <section className="modal-card-body">
          {props.exportStatus === ExportStatus.IN_PROGRESS && (
            <div>
              <button className="button is-loading is-fullwidth is-large"></button>
            </div>
          )}

          {props.exportStatus === ExportStatus.DONE && props.canvas && (
            <div className={"preview"}>
              <img src={props.canvas.toDataURL()} alt={"Export"} />
            </div>
          )}

          {(props.exportStatus === ExportStatus.ERROR ||
            (props.exportStatus === ExportStatus.DONE && !props.canvas)) && (
            <p>Erreur lors de l'exportation</p>
          )}
        </section>
        <footer className="modal-card-foot">
          <button
            className="button is-large"
            onClick={props.onClose}
            disabled={props.exportStatus === ExportStatus.IN_PROGRESS}
          >
            Fermer
          </button>
          {props.exportStatus === ExportStatus.DONE && props.canvas && (
            <a
              download={props.fileName + ".jpg"}
              href={props.canvas.toDataURL("image/jpeg")}
            >
              <button className={"button is-large is-info"}>
                <span className="icon is-small">
                  <FontAwesomeIcon icon={faDownload} />
                </span>
                <span>Enregistrer l'image</span>
              </button>
            </a>
          )}
        </footer>
      </div>
    </div>
  );
}

export default ReportPage;
