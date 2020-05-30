import React from "react";
import "./HelpPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";

function ImportHelpSection() {
  return (
    <div className="content">
      <h4>Nommer les mesures</h4>

      <p>
        Lors de l'importation de mesures, il est possible d'indiquer un nom afin
        d'identifier rapidement ces dernières.
        <br /> Le nom est facultatif et n'a pas besoin d'être unique.
      </p>

      <h4>Selectionner le fichier de mesures</h4>

      <p>
        L'importation des mesures n'accepte que le format CSV. Les entêtes
        suivantes doivent être présentes dans le fichier :
      </p>

      <pre>
        Reading #,Method Name,Elevation,Latitude,Longitude,Date,Time, Units,[XX
        Concentration, XX Error1s]?,Divers,Opérateur,Projet
      </pre>

      <ul>
        <li>
          "XX Concentration" correspond à la concentration pour l'élément XX
          (exemple: "<em>Ag Concentration</em>"
        </li>
        <li>
          "XX Error1s" correspond à la marge d'erreur pour l'élément XX
          (exemple: "<em>Ag Error1s</em>"
        </li>
        <li>
          Les mesures sont groupées en fonction de la valeur dans le colonne
          "Divers"
        </li>
        <li>
          L'importation reste fonctionnel si la première ligne du fichier
          contient un indicateur de séparateur (ex. "<em>sep=,</em>")
        </li>
      </ul>

      <h4>Historique des mesures importées</h4>

      <p>
        Il n'est pas necessaire d'importer un fichier à chaque fois pour le
        visualiser. En effet, un système d'historique est disponible dans
        l'application via le bouton{" "}
        <span className="icon is-small">
          <FontAwesomeIcon icon={faHistory} />
        </span>{" "}
        présent dans le menu de navigation.
      </p>
      <p>
        De plus, les mesures ignorées via la section "Données brutes" sont
        gardées en mémoire et restaurées lors de l'utilisation de l'historique.
      </p>
    </div>
  );
}

export default ImportHelpSection;
