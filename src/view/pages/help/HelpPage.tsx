import React, { Component } from "react";
import "./HelpPage.css";
import ImportHelpSection from "./ImportHelpSection";
import {version} from './../../../../package.json'
import RawDataHelpSection from "./RawDataHelpSection";
import ReportHelpSection from "./ReportHelpSection";

const HelpSections = {
  IMPORT: "Importer un document",
  RAW_DATA: "Données brutes",
  REPORT: "Rapport"
}

type HelpSections = typeof HelpSections[keyof typeof HelpSections];

class HelpPage extends Component<{}, {selectedSection: HelpSections}> {
  constructor(props: {}) {
    super(props);

    this.state = {
      selectedSection: HelpSections.IMPORT
    }
  }

  getSectionToRender = () => {
    switch (this.state.selectedSection) {
      case HelpSections.RAW_DATA:
        return <RawDataHelpSection/>
      case HelpSections.REPORT:
        return <ReportHelpSection/>;
      default:
      case HelpSections.IMPORT:
        return <ImportHelpSection/>;
    }
  };

  render() {
    const tabSections = Object.values(HelpSections).map((value, index) => <li key={index} className={value === this.state.selectedSection ? "is-active" : undefined}><a href="/#" onClick={() => this.setState({selectedSection: value})}>{value}</a></li>)


    return (
      <div className="help-container">
        <h1 className="title">Aide sur l'application</h1>
        <div className="tabs is-toggle is-fullwidth is-large">
          <ul>{tabSections}</ul>
        </div>

        <div id="help-section-container">
          {this.getSectionToRender()}
        </div>

        <div className="credit">
          <p><b>Vanta Scrooting Tool v. {version}</b> - A tool created by <a href="https://github.com/omnisnash">omnisnash</a> and <a href="https://github.com/CottinThomas">CottinThomas</a> - Source code on <a href="https://github.com/MielPoPSCrew/vanta-scooting-tool">Github</a> under license GPL-3.0</p>
        </div>
      </div>
    );
  }
}

export default HelpPage;
