import React from "react";
import "./Notification.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";

interface UpdateNotificationProps {
  onClose: () => void;
  onRefresh: () => void;
  isUpdating: boolean;
}

function UpdateNotification(props: UpdateNotificationProps) {
  return (
    <div className="update-notification modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="notification">
          <button className="delete is-large" onClick={props.onClose}></button>
          <br />
          Une mise à jour de l'application est disponible !<br />
          <br />
        </div>
        <button
          className={
            "button is-info is-large is-fullwidth " +
            (props.isUpdating ? "is-loading" : "")
          }
          onClick={props.onRefresh}
        >
          <span className="icon is-small">
            <FontAwesomeIcon icon={faSyncAlt} />
          </span>
          <span>Actualiser</span>
        </button>
      </div>
    </div>
  );
}

export default UpdateNotification;
