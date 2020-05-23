import React from "react";
import "./HelpPage.css";
import RawDataValueImgPath from "./img/raw-data-value.jpg";
import RawDataLodImgPath from "./img/raw-data-lod.jpg";
import RawDataIgnoredGroupImgPath from "./img/raw-data-ignored-group.jpg";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function RawDataHelpSection() {
  return (
    <div className="content">
      <h4>Affichage des mesures</h4>

      <p>
        Les mesures sont regroupées par groupe (identifié dans le CSV via la
        colonne "Divers").
      </p>

      <div className="columns">
        <div className="column is-narrow">
          <img src={RawDataValueImgPath} alt="Affichage d'une concentration" />
        </div>
        <div className="column">
          La valeur en noir correspond à la mesure de la concentration pour un
          élément chimique.
          <br />
          La valeur en rouge correspond à la marge d'erreur.{" "}
        </div>
      </div>

      <div className="columns">
        <div className="column is-narrow">
          <img src={RawDataLodImgPath} alt="Concentration avec un LOD" />
        </div>
        <div className="column">
          Si la concentration est en dessous de la limite de détection, la
          valeur affiche "LOD".
        </div>
      </div>

      <h4>Ignorer des mesures</h4>

      <p>
        Il est possible d'ignorer une mesure en cliquant sur le bouton{" "}
        <span className="icon is-small">
          <FontAwesomeIcon icon={faBan} />
        </span>{" "}
        de la ligne correspondante.
      </p>

      <div className="columns">
        <div className="column is-narrow">
          <img
            src={RawDataIgnoredGroupImgPath}
            alt="Groupe de mesures ignorées"
          />
        </div>
        <div className="column">
          Si toutes les mesures d'un groupe sont ignorées, le nom du groupe est
          barré. De plus, le groupe n'apparaîtra pas dans la partie "Rapport".
        </div>
      </div>
    </div>
  );
}

export default RawDataHelpSection;
