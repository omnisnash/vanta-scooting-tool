import React from "react";
import "./HelpPage.css";
import ReportValueImgPath from "./img/report_value.jpg";
import ReportLodImgPath from "./img/report_lod.jpg";
import ReportRefImgPath from "./img/report_ref.jpg";
import ReportRefConcentrationImgPath from "./img/report_ref_concentration.jpg";
import ReportRefIncertitudeImgPath from "./img/report_ref_incertitude.jpg";

function ReportHelpSection() {
  return (
    <div className="content">
      <h4>Aggrégation des mesures</h4>

      <p>
        Les mesures sont aggrégées et regroupées par groupe (identifié dans le
        CSV via la colonne "Divers").
      </p>

      <div className="columns">
        <div className="column is-narrow">
          <img
            src={ReportValueImgPath}
            alt="Affichage d'une moyenne de concentration"
          />
        </div>
        <div className="column">
          <p>
            <span className="tag is-info">1</span> Moyenne des concentrations
            d'un groupe pour un élément chimique. Les mesures ignorées{" "}
            <b>ne sont pas</b> incluses dans cette moyenne.
            <br />
            <span className="tag is-info">2</span> Moyenne des marges d'erreurs
            d'un groupe pour un élément chimique. Les mesures ignorées{" "}
            <b>sont</b> incluses dans cette moyenne.
            <br />
            <span className="tag is-info">3</span> Equart-type des
            concentrations d'un groupe pour un élément chimique. Les mesures
            ignorées <b>ne sont pas</b> incluses dans ce calcul.
            <br />
          </p>
        </div>
      </div>

      <div className="columns">
        <div className="column is-narrow">
          <img
            src={ReportLodImgPath}
            alt="Moyenne de concentration avec un LOD"
          />
        </div>
        <div className="column">
          Si la moyenne des concentrations est en dessous de la limite de
          détection, la valeur affiche "LOD".
        </div>
      </div>

      <h4>Mise en forme conditionnelle</h4>

      <p>
        La mise en forme conditionnelle est déterminée en fonction de la{" "}
        <span className="tag is-info">1</span> valeur de la moyenne des
        concentrations. Si l'option "<b>Utiliser l'erreur</b>" est activée,
        alors la valeur prise en compte est{" "}
        <span className="tag is-info">1</span> la moyenne des concentrations
        additionnée à <span className="tag is-info">2</span> la moyenne des
        marges d'erreurs. La mise en forme conditionnelle peut être désactivée
        avec l'option "<b>Coloration</b>".
      </p>

      <div className="columns">
        <div className="column is-narrow">
          <img src={ReportRefImgPath} alt="Referentiels d'un élément" />
        </div>
        <div className="column">
          <p>
            Des référentiels peuvent être associés à un élément chimique. Si
            c'est le cas, leur valeur est rappelée sous l'élément.
          </p>
        </div>
      </div>

      <div className="columns">
        <div className="column is-narrow">
          <img
            src={ReportRefConcentrationImgPath}
            alt="Mise en forme conditionnelle"
          />
        </div>
        <div className="column">
          <p>
            Si la valeur moyenne de la concentration dépasse un des
            reférentiels, une mise en forme conditionnelle est appliquée.
          </p>
        </div>
      </div>

      <div className="columns">
        <div className="column is-narrow">
          <img src={ReportRefIncertitudeImgPath} alt="Incertitude" />
        </div>
        <div className="column">
          <p>
            Une bordure rouge indique qu'une valeur moyenne de concentration est
            proche, à 10% près, d'un référentiel.
          </p>
        </div>
      </div>

      <h4>Exporter le rapport</h4>

      <p>
        Le tableau contenu dans le rapport peut être exporté sous forme d'image
        via l'option "<b>Exporter</b>".
      </p>
    </div>
  );
}

export default ReportHelpSection;
