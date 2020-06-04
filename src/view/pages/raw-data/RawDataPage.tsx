import React, { Component } from "react";
import "./RawDatePage.css";
import GroupedData, {
  Measure,
  MeasureGroup,
} from "../../../models/GroupedData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import {
  getStoredScrollPosition,
  setScrollPosition,
} from "../../../helpers/LocalStorageHelper";

const SCROLL_ID = "raw-table";

interface RawDatePageProps {
  onIgnoreMeasure: (group: string, id: number) => void;
  onSelectGroup: (group: string) => void;
  defaultSelectedGroup?: string;
  groupedData?: GroupedData;
}

interface IRawDatePageStates {
  selectedGroup?: MeasureGroup;
}

class RawDatePage extends Component<RawDatePageProps, IRawDatePageStates> {
  constructor(props: RawDatePageProps) {
    super(props);

    this.state = {};
  }

  handleTabSelection = (group: MeasureGroup) => {
    this.props.onSelectGroup(group.name);
    this.setState({ selectedGroup: group });
  };

  componentDidMount() {
    const tableContainer = document.getElementById("measures-table-container");

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
    const tableContainer = document.getElementById("measures-table-container");

    if (!tableContainer) {
      return;
    }

    setScrollPosition(SCROLL_ID, {
      top: tableContainer.scrollTop,
      left: tableContainer.scrollLeft,
    });
  }

  render() {
    if (!this.props.groupedData) {
      return (
        <p>
          <strong>Vous devez d'abord importer des mesures.</strong>
        </p>
      );
    }

    const groups = this.props.groupedData;
    const selectedGroup =
      this.state.selectedGroup ||
      groups.measuresGroups.find(
        (group) => group.name === this.props.defaultSelectedGroup
      ) ||
      groups.measuresGroups[0];
    const selectedGroupName = selectedGroup.name;

    const tabs = groups.measuresGroups.map((group) => (
      <li
        key={group.name}
        className={group.name === selectedGroupName ? "is-active" : ""}
      >
        <a
          href="/#"
          onClick={() => this.handleTabSelection(group)}
          className={
            group.measures.some((measure) => !measure.ignored)
              ? ""
              : "line-through"
          }
        >
          {group.name}
        </a>
      </li>
    ));

    return (
      <div className="raw-data-container">
        <h5 className="title is-5">{this.props.groupedData.name}</h5>
        <div className="tabs is-toggle is-fullwidth is-large">
          <ul>{tabs}</ul>
        </div>

        <div id="measures-table-container">
          <MeasuresTable
            groupName={selectedGroupName}
            measures={selectedGroup.measures}
            onIgnoreMeasure={this.props.onIgnoreMeasure}
          />
        </div>
      </div>
    );
  }
}

function MeasuresTable(props: {
  groupName: string;
  measures: Measure[];
  onIgnoreMeasure: (groupName: string, measureId: number) => void;
}) {
  if (!props.measures.length) {
    return <p>Aucune mesure dans ce groupe</p>;
  }

  const elements = props.measures[0].concentrations.map(
    (concentration) => concentration.element
  );
  const rowHeaders = ["", "#", ...elements].map((header) => (
    <th key={header}>{header}</th>
  ));

  const rowsMeasure = props.measures.map((measure) => {
    const elements = measure.concentrations.map((elements) => {
      const classStyle = elements.value === -1 ? "lod" : "value";
      const concentration = elements.value === -1 ? "<LOD" : elements.value;
      const error = elements.error;

      return (
        <td
          key={elements.element}
          className={measure.ignored ? "is-ignored" : ""}
        >
          <span className={classStyle}>{concentration}</span>
          <br />
          <span className={"error"}>{error}</span>
        </td>
      );
    });

    return (
      <tr key={measure.id}>
        <th>
          <div>
            <button
              className={
                "button is-medium " + (measure.ignored ? "is-danger" : "")
              }
              onClick={() => props.onIgnoreMeasure(props.groupName, measure.id)}
            >
              <span className="icon is-small">
                <FontAwesomeIcon icon={faBan} />
              </span>
            </button>
          </div>
        </th>
        <td className={measure.ignored ? "is-ignored" : ""}>{measure.id}</td>

        {elements}
      </tr>
    );
  });

  return (
    <table className="table is-striped is-bordered">
      <thead>
        <tr>{rowHeaders}</tr>
      </thead>
      <tbody>{rowsMeasure}</tbody>
    </table>
  );
}

export default RawDatePage;
