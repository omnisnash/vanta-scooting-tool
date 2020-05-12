import React from "react";
import GroupedData from "../../../models/GroupedData";
import "./HistoryPage.css";

interface HistoryPageProps {
  history: GroupedData[];
  onImportModel: (model: GroupedData) => void;
}

function HistoryPage(props: HistoryPageProps) {
  const items = props.history.map((item) => (
    <HistoryItem
      group={item}
      onImportModel={() => props.onImportModel(item)}
      key={item.createdAt.toString()}
    />
  ));
  return (
    <div className="history">
      <h1 className="title">Historique des mesures</h1>
      {items.length === 0 && <p>Aucune mesures récente</p>}
      <table className="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Nom des mesures</th>
            <th>Date création</th>
            <th>Dernière modification</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </table>
    </div>
  );
}

interface HistoryItemProps {
  group: GroupedData;
  onImportModel: () => void;
}

function HistoryItem(props: HistoryItemProps) {
  return (
    <tr>
      <th>{props.group.name} </th>
      <th>{props.group.createdAt.toLocaleString()}</th>
      <th>
        {props.group.updatedAt ? props.group.updatedAt.toLocaleString() : "-"}
      </th>
      <th>
        <button
          className={"button is-link is-large"}
          onClick={props.onImportModel}
        >
          Importer
        </button>
      </th>
    </tr>
  );
}

export default HistoryPage;
