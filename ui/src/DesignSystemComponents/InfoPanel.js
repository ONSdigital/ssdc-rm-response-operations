import React, {forwardRef} from "react";
import PropTypes from "prop-types";
import Announcer from "react-a11y-announcer";


const InfoPanel = forwardRef((props, ref) => (
    <div
      className="ons-panel ons-panel--info ons-panel--no-title ons-u-mb-s"
      id="InfoSummaryTitle"
      ref={ref}
    >
      <Announcer text={"Information"} />
      <span className="ons-u-vh">Important information: </span>
      <div className="ons-panel__body">
          {props.infoSummary}
      </div>
    </div>
  ));

InfoPanel.displayName = "InfoSummary";

InfoPanel.propTypes = {
  id: PropTypes.string.isRequired,
  infoSummary: PropTypes.array.isRequired,
};

export default InfoPanel;
