import React, { Component, RefObject } from "react";
import "./ImportaitonPage.css";
import GroupedData from "../../../models/GroupedData";
import { getFileExtension, readFile } from "../../../helpers/FileInputReader";
import { measuresFromCsv, isValidCsv } from "../../../helpers/CsvHelper";
import { addMeasurerToHistory } from "../../../helpers/LocalStorageHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

interface ImportProps {
  onImportDate: (model: GroupedData) => void;
}

interface ImportStates {
  importInProgress: boolean;
  measuresName?: string;
  fileName?: string;
  file?: File;
  errors?: string;
}

class ImportationPage extends Component<ImportProps, ImportStates> {
  private fileInput: RefObject<HTMLInputElement>;

  constructor(props: ImportProps) {
    super(props);

    this.fileInput = React.createRef();

    this.state = {
      importInProgress: false,
    };
  }

  startImportation = () => {
    this.setState({ importInProgress: true, errors: undefined });

    if (!this.state.file) {
      this.setState({
        importInProgress: false,
        errors: "Aucun fichier selectionné",
      });
      return;
    }

    const file = this.state.file;

    if (getFileExtension(file) !== "csv") {
      this.setState({
        importInProgress: false,
        errors: "Le fichier doit être un CSV",
      });
      return;
    }

    readFile(file)
      .then((content) => {
        const valid = isValidCsv(content);

        if (!valid.isValid) {
          this.setState({
            importInProgress: false,
            errors: valid.errors.join("\n"),
          });
          return;
        }

        const model = measuresFromCsv(content);
        const groupData: GroupedData = {
          id: "_" + Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          name: this.state.measuresName || this.state.fileName || "new-measure",
          measuresGroups: model,
        };

        addMeasurerToHistory(groupData);
        this.props.onImportDate(groupData);

        this.setState({ importInProgress: false, errors: undefined });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          importInProgress: false,
          errors: "Impossible de lire le fichier",
        });
      });
  };

  handleFileLoaded = () => {
    if (!this.fileInput.current?.files?.length) {
      return;
    }

    const file = this.fileInput.current.files[0];

    this.setState({
      file: file,
      fileName: file.name,
    });
  };

  render() {
    return (
      <div className="import-container">
        <div className="import-content">
          <div className="field">
            <label className="label is-large">Nom des mesures:</label>
            <div className="control">
              <input
                onChange={(event) =>
                  this.setState({ measuresName: event.target.value })
                }
                className="input is-large"
                type="text"
                placeholder="MesBellesMesures"
              />
            </div>
          </div>
          <div
            className="file has-name is-boxed"
            style={{ display: "inline-block", marginBottom: 34, width: "100%" }}
          >
            <label className="file-label">
              <input
                onChange={this.handleFileLoaded}
                ref={this.fileInput}
                className="file-input is-fullwidth"
                type="file"
                name="resume"
                accept="text/csv"
              />
              <span className="file-cta">
                <span className="file-icon">
                  <FontAwesomeIcon icon={faUpload} />
                </span>
                <span className="file-label">Fichier CSV...</span>
              </span>
              <span
                className="file-name"
                style={{ width: "100%", maxWidth: "100%", textAlign: "center" }}
              >
                {this.state.fileName || "Aucun fichier selectionné"}
              </span>
            </label>
          </div>
          <button
            className={
              "button is-info is-large is-fullwidth " +
              (this.state.importInProgress ? "is-loading" : "")
            }
            disabled={this.state.importInProgress}
            onClick={this.startImportation}
          >
            Démarrer l'importation
          </button>
          {this.state.errors && (
            <div className="notification is-danger is-light">
              <strong>Erreur: </strong>
              {this.state.errors}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ImportationPage;
