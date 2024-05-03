import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "./Home";
import CreateSurvey from "./CreateSurvey";
import Surveys from "./Surveys";
import ViewSurvey from "./ViewSurvey";
import ExportFileTemplates from "./ExportFileTemplates";
import NotFound from "./NotFound";
import CreateExportFileTemplate from "./CreateExportFileTemplate";
import { Helmet } from "react-helmet";
import GroupAdmin from "./GroupAdmin";
import DeleteUserFromGroupConfirmation from "./DeleteUserFromGroupConfirmation";
import MyGroupsAdmin from "./MyGroupsAdmin";
import AddUserToGroup from "./AddUserToGroup";
import PropTypes from "prop-types";

function App() {
  const [loading, setLoading] = useState(true);
  const [authorisedActivities, setAuthorisedActivities] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/auth");
      setLoading(false);

      if (response.ok) {
        const authorisedActivities = await response.json();

        setAuthorisedActivities(authorisedActivities);
      }
    }
    fetchData();
  }, []);

  return (
    <Router>
      <Helmet>
        <title>Response Operations</title>
      </Helmet>
      <div className="ons-page account">
        <div className="ons-page__content">
          <header className="ons-header ons-header--internal" role="banner">
            <div className="ons-header__top">
              <div className="ons-container">
                <div className="ons-header__grid-top ons-grid ons-grid--gutterless ons-grid--flex ons-grid--between ons-grid--vertical-center ons-grid--no-wrap">
                  <div className="ons-grid__col ons-col-auto">
                    <div className="ons-header__logo--large">
                      <svg
                        className="ons-svg-logo"
                        xmlns="http://www.w3.org/2000/svg"
                        width="197"
                        height="19"
                        viewBox="33 2 552 60"
                      >
                        <title id="ons-logo-en-alt">
                          Office for National Statistics logo
                        </title>
                        <path
                          className="ons-svg-logo--accent"
                          d="M0,34.6c.8-1.69,1.39-3,2.32-4.6A38.28,38.28,0,0,1,0,23.4V34.6M5,3S0,3,0,9.25v1A62.12,62.12,0,0,0,4.2,27a43.77,43.77,0,0,1,9.42-10.79C21.69,9.21,31.16,5.13,45.9,3Z"
                        />
                        <path d="M53.06,6.42C36.2,8,24.68,12.92,16.43,20.07A41.46,41.46,0,0,0,6.4,32.2C12.87,44.93,28.88,57,46.6,57H47s6.32.21,6.32-6.91V6.36a1.22,1.22,0,0,1-.26.06M9.72,42.67a44.25,44.25,0,0,1-5-7.42A80.59,80.59,0,0,0,0,46.38V56.91L31.06,57c-9.83-3-15.74-7.64-21.34-14.3" />
                        <path d="M82,47.49c-9.07,0-13.13-7.51-13.13-16.77S72.91,14,82,14s13.1,7.61,13.1,16.77S91.1,47.54,82,47.54m0-30.91c-6.69,0-9.07,7.33-9.07,14.05s2.16,13.9,9.07,13.9,9-7.28,9-13.9-2.34-14-9-14" />
                        <path d="M106.36,23.81V46.88h-3.67V23.81H98.93V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.38,0,.86.05.86.05v2.35h-.43c-2.55,0-4.84,1.64-4.84,5.12v4.09h5.27v2.25Z" />
                        <path d="M121.53,23.81V46.88h-3.67V23.81H114.1V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.38,0,.86.05.86.05v2.35h-.43c-2.55,0-4.84,1.64-4.84,5.12v4.09h5.27v2.25Z" />
                        <path d="M132.85,16.72a2.28,2.28,0,0,1-2.33-2.23v0a2.34,2.34,0,0,1,4.67,0,2.28,2.28,0,0,1-2.3,2.26h0M131,21.56h3.71V46.88H131Z" />
                        <path d="M150.53,47.49c-6,0-10.63-5.16-10.63-13.29S144.52,21,150.66,21a9.76,9.76,0,0,1,6.17,1.74l-1,2.25a7.53,7.53,0,0,0-4.4-1.36c-5.15,0-7.78,4.46-7.78,10.48,0,6.2,3,10.62,7.65,10.62a8,8,0,0,0,4.49-1.37l1,2.45a10.21,10.21,0,0,1-6.3,1.73" />
                        <path d="M162.84,35.75c.48,6,3.76,9,8.9,9a14.66,14.66,0,0,0,6.88-1.55l1.08,2.59a18,18,0,0,1-8.22,1.73c-7.12,0-12.18-4.23-12.18-13.34,0-8.69,4.67-13.2,11-13.2s10.37,3.95,10.37,12.4Zm7.35-12.41c-4.1,0-7.56,3.2-7.52,10.29l14.39-2c0-5.87-2.81-8.32-6.87-8.32" />
                        <path d="M198.57,23.81V46.88H194.9V23.81h-3.76V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.39,0,.87.05.87.05v2.35h-.44c-2.54,0-4.84,1.64-4.84,5.12v4.09h5.28v2.25Z" />
                        <path d="M217.28,47.49c-7.47,0-10.89-5.78-10.89-13.24S209.81,21,217.28,21s10.85,5.82,10.85,13.3-3.37,13.24-10.85,13.24m0-24c-5.53,0-7.13,5.59-7.13,10.81s1.73,10.56,7.13,10.56,7.13-5.35,7.13-10.56-1.6-10.81-7.13-10.81" />
                        <path d="M244.08,23.91c-2.34-.61-5.75-.52-7.35.47v22.5H233V22.69c2.67-1.13,5.36-1.74,10.11-1.74H245Z" />
                        <path d="M277.42,47.13,263.07,25a32.2,32.2,0,0,1-1.85-3.29h-.09s.13,1.88.13,3.85V47.13h-4.71V14.8h5.31l13.61,20.82A28.76,28.76,0,0,1,277.38,39h.08s-.17-1.84-.17-3.77V14.8H282V47.13Z" />
                        <path d="M297.52,47.79c-7.43,0-10.93-3-10.93-7.81,0-6.8,7.12-8.64,15.59-9.39V29.13c0-3.47-2.37-4.51-5.83-4.51a18,18,0,0,0-6.87,1.46L288.23,23a24,24,0,0,1,9.12-1.83c5.61,0,9.93,2.3,9.93,8.78V46a22.71,22.71,0,0,1-9.76,1.83m4.66-14.67c-6.26.67-10.45,1.84-10.45,6.73,0,3.42,2.42,4.88,6.22,4.88a10.09,10.09,0,0,0,4.23-.84Z" />
                        <path d="M322,47.69c-5.31,0-7.34-3.43-7.34-6.86V25.09h-3.55V21.81h3.55V16.12l5.4-1.5v7.19H325v3.28h-5V40.55a3.26,3.26,0,0,0,3,3.52h.5a5.5,5.5,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52" />
                        <path d="M331.91,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.44V47.13h-5.44Z" />
                        <path d="M350.88,47.79c-7.73,0-11.57-5.74-11.57-13.3s3.84-13.34,11.57-13.34,11.54,5.78,11.54,13.34-3.8,13.3-11.54,13.3m0-23.17c-4.66,0-6.05,4.89-6.05,9.82s1.47,9.63,6.05,9.63,6.05-4.7,6.05-9.63-1.38-9.82-6.05-9.82" />
                        <path d="M382.52,47.13V29c0-3.24-2.77-4.47-5.88-4.47a12.3,12.3,0,0,0-4.37.76v21.8h-5.39V23a26.81,26.81,0,0,1,10.06-1.83c6.61,0,11,2.25,11,7.8V47.13Z" />
                        <path d="M403.18,47.79c-7.43,0-10.94-3-10.94-7.81,0-6.8,7.13-8.64,15.6-9.39V29.13c0-3.47-2.37-4.51-5.83-4.51a18,18,0,0,0-6.87,1.46L393.89,23A24,24,0,0,1,403,21.15c5.62,0,9.94,2.3,9.94,8.78V46a22.71,22.71,0,0,1-9.76,1.83m4.66-14.67c-6.27.67-10.46,1.84-10.46,6.73,0,3.42,2.43,4.88,6.23,4.88a10.09,10.09,0,0,0,4.23-.84Z" />
                        <polygon points="418.52 47.13 418.52 34.91 418.52 10.25 423.92 10.25 423.92 22.76 423.92 47.13 418.52 47.13" />
                        <path d="M445.39,47.79A19.11,19.11,0,0,1,436.58,46l1.51-4a13.48,13.48,0,0,0,6.22,1.55c3.76,0,6.44-2.21,6.44-5.41,0-7.09-13.44-4.36-13.44-14.42,0-5.13,4.15-9.59,10.72-9.59A15.82,15.82,0,0,1,455.8,16l-1.38,3.52a11.93,11.93,0,0,0-5.66-1.5c-3.5,0-5.79,2.11-5.79,5.12,0,7,13.74,3.94,13.74,14.65,0,5.74-4.71,10-11.32,10" />
                        <path d="M470.41,47.69c-5.31,0-7.34-3.43-7.34-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.92v3.28h-4.92V40.55a3.27,3.27,0,0,0,3,3.52h.48a5.12,5.12,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52" />
                        <path d="M487.27,47.79c-7.44,0-10.93-3-10.93-7.81,0-6.8,7.13-8.64,15.6-9.39V29.13c0-3.47-2.38-4.51-5.84-4.51a18,18,0,0,0-6.87,1.46L478,23a23.94,23.94,0,0,1,9.11-1.83c5.62,0,9.94,2.3,9.94,8.78V46a22.71,22.71,0,0,1-9.76,1.83M492,33.16c-6.27.67-10.46,1.84-10.46,6.73,0,3.42,2.42,4.88,6.22,4.88a10,10,0,0,0,4.24-.84Z" />
                        <path d="M511.73,47.69c-5.32,0-7.35-3.43-7.35-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.92v3.28h-4.92V40.55a3.26,3.26,0,0,0,3,3.52h.5a5.5,5.5,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52" />
                        <path d="M521.66,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.45V47.13h-5.45Z" />
                        <path d="M536.19,47.79A15.9,15.9,0,0,1,528.54,46L530,42.48a10.53,10.53,0,0,0,5.52,1.5c2.77,0,5-1.78,5-3.94,0-6-11.1-3.2-11.1-11.47,0-3.76,3.37-7.42,8.86-7.42A13.56,13.56,0,0,1,545.34,23l-1.42,3.14a8.47,8.47,0,0,0-4.62-1.45c-2.81,0-4.54,1.69-4.54,3.62,0,5.64,11.32,3.14,11.32,11.6,0,4-3.85,7.9-9.89,7.9" />
                        <path d="M559.83,47.69c-5.31,0-7.35-3.43-7.35-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.93v3.28h-4.93V40.55a3.27,3.27,0,0,0,3,3.52h.48a5.64,5.64,0,0,0,1.47-.23v3.33a7.72,7.72,0,0,1-3,.52" />
                        <path d="M569.77,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.44V47.13h-5.44Z" />
                        <path d="M588.14,47.79c-6.23,0-11-5.08-11-13.35s4.88-13.29,11-13.29A10.51,10.51,0,0,1,594.66,23l-1.21,3a6.87,6.87,0,0,0-4-1.22c-4.4,0-6.69,3.81-6.69,9.49s2.63,9.59,6.61,9.59a6.74,6.74,0,0,0,4-1.28L594.7,46c-1.12.94-3.33,1.84-6.56,1.84" />
                        <path d="M605.1,47.79A15.9,15.9,0,0,1,597.45,46l1.42-3.47A10.54,10.54,0,0,0,604.4,44c2.77,0,5-1.78,5-3.94,0-6-11.1-3.2-11.1-11.47,0-3.76,3.37-7.42,8.85-7.42a13.49,13.49,0,0,1,7.1,1.83l-1.42,3.14a8.42,8.42,0,0,0-4.63-1.45c-2.8,0-4.53,1.69-4.53,3.62,0,5.64,11.32,3.14,11.32,11.6,0,4-3.85,7.9-9.89,7.9" />
                      </svg>
                    </div>
                    <div className="ons-header__logo--small">
                      <svg
                        className="ons-svg-logo"
                        xmlns="http://www.w3.org/2000/svg"
                        width="120"
                        height="27"
                        viewBox="0 5 595 116"
                      >
                        <title id="ons-logo-stacked-en-alt">
                          Office for National Statistics logo
                        </title>
                        <path
                          className="ons-svg-logo--accent"
                          d="M0,70.5c1.8-3.7,3.6-7.2,5.6-10.7A127.94,127.94,0,0,1,0,42.6V70.5M10.9,0S0,0,0,13.5v7.2A128.06,128.06,0,0,0,7.9,56.2a114.75,114.75,0,0,1,22.3-26C47.8,15.1,71.5,4.7,103.7.1Z"
                        />
                        <path d="M115.9,7.3c-36.8,3.5-62,14-80,29.4a108.15,108.15,0,0,0-23.6,29c14.1,27.4,41.1,47.6,86,50.5h4.4s13.8.5,13.8-14.9V7.2l-.6.1M21.2,85.4a92.68,92.68,0,0,1-11-16A173,173,0,0,0,0,93.4v22.7l73.6.1c-22.9-5.5-40.1-16.4-52.4-30.8" />
                        <path d="M161,51.9c-11.3,0-16.3-9.3-16.3-20.8s5-20.8,16.3-20.8,16.3,9.5,16.3,20.8c-.1,11.5-5.1,20.8-16.3,20.8m0-38.3c-8.3,0-11.3,9.1-11.3,17.4s2.7,17.3,11.3,17.3,11.2-9.1,11.2-17.3S169.3,13.6,161,13.6m30.2,8.9V51.2h-4.5V22.6H182V19.8h4.7V15.2c0-5.7,3.4-9.9,10-9.9a8,8,0,0,1,1.1.1V8.3h-.5c-3.2,0-6,2.1-6,6.4v5.1h6.6v2.8l-6.7-.1Zm18.9,0V51.2h-4.5V22.6h-4.7V19.8h4.7V15.2c0-5.7,3.4-9.9,10-9.9a8,8,0,0,1,1.1.1V8.3h-.5c-3.2,0-6,2.1-6,6.4v5.1h6.6v2.8l-6.7-.1Zm14-8.8a2.82,2.82,0,0,1-2.9-2.8,2.9,2.9,0,0,1,5.8,0,2.76,2.76,0,0,1-2.9,2.8m-2.3,6h4.6V51.2h-4.6Zm24.3,32.2c-7.4,0-13.2-6.4-13.2-16.5,0-10.3,5.8-16.5,13.4-16.5a12.36,12.36,0,0,1,7.7,2.2l-1.2,2.8a8.92,8.92,0,0,0-5.5-1.7c-6.4,0-9.7,5.5-9.7,13,0,7.7,3.7,13.2,9.5,13.2a9.8,9.8,0,0,0,5.6-1.7l1.2,3c-1.3,1.2-4,2.2-7.8,2.2m15.3-14.6c.6,7.4,4.7,11.1,11.1,11.1a18.36,18.36,0,0,0,8.5-1.9l1.3,3.2a22.58,22.58,0,0,1-10.2,2.1c-8.8,0-15.1-5.3-15.1-16.6,0-10.8,5.8-16.4,13.7-16.4s12.9,4.9,12.9,15.4l-22.2,3.1ZM270.5,22c-5.1,0-9.4,4-9.3,12.8l17.9-2.5C279,25,275.5,22,270.5,22m42.2.5V51.2h-4.5V22.6h-4.7V19.8h4.7V15.2c0-5.7,3.4-9.9,10-9.9a8,8,0,0,1,1.1.1V8.3h-.5c-3.2,0-6,2.1-6,6.4v5.1h6.6v2.8Zm23.2,29.4c-9.3,0-13.5-7.2-13.5-16.5s4.2-16.5,13.5-16.5,13.5,7.2,13.5,16.5-4.2,16.5-13.5,16.5m0-29.8c-6.9,0-8.8,7-8.8,13.4s2.1,13.1,8.8,13.1c6.9,0,8.9-6.6,8.9-13.1s-2-13.4-8.9-13.4m33.3.6c-2.9-.8-7.1-.6-9.1.6V51.2h-4.6V21.1c3.3-1.4,6.6-2.2,12.5-2.2h2.4c0,.1-1.2,3.8-1.2,3.8ZM171.3,114.8,153.5,87.3c-1.3-2.1-2.3-4.1-2.3-4.1h-.1s.2,2.3.2,4.8v26.8h-5.8V74.7h6.6L169,100.5a46.13,46.13,0,0,1,2.4,4.1h.1s-.2-2.3-.2-4.7V74.6h5.9v40.1l-5.9.1Zm25,.8c-9.2,0-13.6-3.7-13.6-9.7,0-8.5,8.8-10.7,19.4-11.7V92.4c0-4.3-2.9-5.6-7.2-5.6a22.34,22.34,0,0,0-8.5,1.8l-1.6-3.8a30.2,30.2,0,0,1,11.3-2.3c7,0,12.3,2.9,12.3,10.9v19.9c-2.7,1.4-6.9,2.3-12.1,2.3m5.8-18.2c-7.8.8-13,2.3-13,8.3,0,4.2,3,6.1,7.7,6.1a12.33,12.33,0,0,0,5.3-1.1Zm24.5,18.1c-6.6,0-9.1-4.3-9.1-8.5V87.5h-4.4V83.4h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2c0,2.5,1.4,4.4,4.3,4.4a5.66,5.66,0,0,0,1.8-.3v4.1a11.47,11.47,0,0,1-3.7.6M239,77.9a3.52,3.52,0,1,1,3.9-3.5,3.71,3.71,0,0,1-3.9,3.5m-3.4,5.5h6.8v31.4h-6.8Zm26.9,32.2c-9.6,0-14.4-7.1-14.4-16.5s4.8-16.6,14.4-16.6,14.3,7.2,14.3,16.6-4.7,16.5-14.3,16.5m0-28.7c-5.8,0-7.5,6.1-7.5,12.2s1.8,11.9,7.5,11.9,7.5-5.8,7.5-11.9-1.7-12.2-7.5-12.2m39.3,27.9V92.3c0-4-3.4-5.5-7.3-5.5a16,16,0,0,0-5.4.9v27.1h-6.7v-30a32.8,32.8,0,0,1,12.5-2.3c8.2,0,13.7,2.8,13.7,9.7v22.6Zm25.7.8c-9.2,0-13.6-3.7-13.6-9.7,0-8.5,8.9-10.7,19.4-11.7V92.4c0-4.3-2.9-5.6-7.2-5.6a22.34,22.34,0,0,0-8.5,1.8L316,84.8a30.2,30.2,0,0,1,11.3-2.3c7,0,12.3,2.9,12.3,10.9v19.9c-2.7,1.4-6.9,2.3-12.1,2.3m5.8-18.2c-7.8.8-13,2.3-13,8.3,0,4.2,3,6.1,7.7,6.1a12.33,12.33,0,0,0,5.3-1.1Zm13.2,17.4V69h6.7v45.8Zm38.6.8a23.94,23.94,0,0,1-10.9-2.3l1.9-4.9a17,17,0,0,0,7.7,1.9c4.7,0,8-2.7,8-6.7,0-8.8-16.7-5.4-16.7-17.9,0-6.4,5.2-11.9,13.3-11.9a20.22,20.22,0,0,1,9.7,2.3l-1.7,4.4a14.57,14.57,0,0,0-7-1.9c-4.3,0-7.2,2.6-7.2,6.4,0,8.6,17.1,4.9,17.1,18.2-.1,7.1-6,12.4-14.2,12.4m31.1-.1c-6.6,0-9.1-4.3-9.1-8.5V87.5h-4.4V83.4h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2a4.07,4.07,0,0,0,4.3,4.4,5.66,5.66,0,0,0,1.8-.3v4.1a12.06,12.06,0,0,1-3.7.6m20.9.1c-9.2,0-13.6-3.7-13.6-9.7,0-8.5,8.9-10.7,19.4-11.7V92.4c0-4.3-2.9-5.6-7.2-5.6a22.34,22.34,0,0,0-8.5,1.8l-1.6-3.8a30.2,30.2,0,0,1,11.3-2.3c7,0,12.3,2.9,12.3,10.9v19.9c-2.6,1.4-6.9,2.3-12.1,2.3m5.8-18.2c-7.8.8-13,2.3-13,8.3,0,4.2,3,6.1,7.7,6.1a12.33,12.33,0,0,0,5.3-1.1Zm24.6,18.1c-6.6,0-9.1-4.3-9.1-8.5V87.5H454V83.4h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2a4.07,4.07,0,0,0,4.3,4.4,5.66,5.66,0,0,0,1.8-.3v4.1a12.69,12.69,0,0,1-3.7.6m12.3-37.6a3.52,3.52,0,1,1,3.9-3.5,3.65,3.65,0,0,1-3.9,3.5m-3.4,5.5h6.8v31.4h-6.8Zm21.4,32.2a19.46,19.46,0,0,1-9.5-2.3l1.8-4.3a13.21,13.21,0,0,0,6.9,1.9c3.4,0,6.2-2.2,6.2-4.9,0-7.5-13.8-4-13.8-14.2,0-4.7,4.2-9.2,11-9.2a16.21,16.21,0,0,1,8.8,2.3l-1.8,3.9a10.31,10.31,0,0,0-5.7-1.8c-3.5,0-5.6,2.1-5.6,4.5,0,7,14,3.9,14,14.4,0,4.9-4.7,9.7-12.3,9.7m29.4-.1c-6.6,0-9.1-4.3-9.1-8.5V87.5h-4.4V83.4h4.4v-7l6.7-1.9v8.9h6.1v4.1h-6.1v19.2c0,2.5,1.4,4.4,4.3,4.4a5.66,5.66,0,0,0,1.8-.3v4.1a12.06,12.06,0,0,1-3.7.6m12.3-37.6a3.52,3.52,0,1,1,3.9-3.5c.1,2-1.7,3.5-3.9,3.5m-3.3,5.5H543v31.4h-6.8Zm26.2,32.2c-7.7,0-13.6-6.3-13.6-16.6s6.1-16.5,13.7-16.5c3.9,0,6.6,1.1,8,2.3L569,88.6a8.61,8.61,0,0,0-4.9-1.5c-5.5,0-8.3,4.7-8.3,11.8s3.3,11.9,8.2,11.9a8.39,8.39,0,0,0,4.9-1.6l1.7,4.1c-1.5,1.2-4.2,2.3-8.2,2.3m20.6,0a19.46,19.46,0,0,1-9.5-2.3l1.8-4.3a13.21,13.21,0,0,0,6.9,1.9c3.4,0,6.2-2.2,6.2-4.9,0-7.5-13.8-4-13.8-14.2,0-4.7,4.2-9.2,11-9.2a16.85,16.85,0,0,1,8.9,2.3l-1.8,3.9A10.31,10.31,0,0,0,587,87c-3.5,0-5.6,2.1-5.6,4.5,0,7,14,3.9,14,14.4-.1,4.9-4.9,9.7-12.4,9.7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ons-header__main">
                <div className="ons-container">
                  <div className="ons-grid ons-grid--gutterless ons-grid--flex ons-grid--between ons-grid--vertical-center ons-grid--no-wrap">
                    <div className="ons-grid__col ons-col-auto ons-u-flex-shrink">
                      <Link to="/" className="ons-header__title-link">
                        <div className="ons-header__title">
                          Response Management Operations
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="ons-page__container ons-container ">
            <div className="ons-grid">
              <div className="ons-grid__col ons-col-8@m">
                <main id="main-content" className="ons-page__main ">
                  {authorisedActivities.length === 0 && !loading && (
                    <p>User not authorised</p>
                  )}
                  {authorisedActivities.length > 0 && (
                    <QueryRouting authorisedActivities={authorisedActivities} />
                  )}
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="ons-footer">
        <div className="ons-footer__body" data-analytics="footer">
          <div className="ons-container">
            <div className="ons-grid">
              <div className="ons-grid__col">
                <svg
                  className="ons-svg-logo"
                  xmlns="http://www.w3.org/2000/svg"
                  width="197"
                  height="19"
                  viewBox="33 2 552 60"
                >
                  <title id="ons-logo-en-alt">
                    Office for National Statistics
                  </title>
                  <path
                    className="ons-svg-logo--accent"
                    d="M0,34.6c.8-1.69,1.39-3,2.32-4.6A38.28,38.28,0,0,1,0,23.4V34.6M5,3S0,3,0,9.25v1A62.12,62.12,0,0,0,4.2,27a43.77,43.77,0,0,1,9.42-10.79C21.69,9.21,31.16,5.13,45.9,3Z"
                  />
                  <path d="M53.06,6.42C36.2,8,24.68,12.92,16.43,20.07A41.46,41.46,0,0,0,6.4,32.2C12.87,44.93,28.88,57,46.6,57H47s6.32.21,6.32-6.91V6.36a1.22,1.22,0,0,1-.26.06M9.72,42.67a44.25,44.25,0,0,1-5-7.42A80.59,80.59,0,0,0,0,46.38V56.91L31.06,57c-9.83-3-15.74-7.64-21.34-14.3" />
                  <path d="M82,47.49c-9.07,0-13.13-7.51-13.13-16.77S72.91,14,82,14s13.1,7.61,13.1,16.77S91.1,47.54,82,47.54m0-30.91c-6.69,0-9.07,7.33-9.07,14.05s2.16,13.9,9.07,13.9,9-7.28,9-13.9-2.34-14-9-14" />
                  <path d="M106.36,23.81V46.88h-3.67V23.81H98.93V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.38,0,.86.05.86.05v2.35h-.43c-2.55,0-4.84,1.64-4.84,5.12v4.09h5.27v2.25Z" />
                  <path d="M121.53,23.81V46.88h-3.67V23.81H114.1V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.38,0,.86.05.86.05v2.35h-.43c-2.55,0-4.84,1.64-4.84,5.12v4.09h5.27v2.25Z" />
                  <path d="M132.85,16.72a2.28,2.28,0,0,1-2.33-2.23v0a2.34,2.34,0,0,1,4.67,0,2.28,2.28,0,0,1-2.3,2.26h0M131,21.56h3.71V46.88H131Z" />
                  <path d="M150.53,47.49c-6,0-10.63-5.16-10.63-13.29S144.52,21,150.66,21a9.76,9.76,0,0,1,6.17,1.74l-1,2.25a7.53,7.53,0,0,0-4.4-1.36c-5.15,0-7.78,4.46-7.78,10.48,0,6.2,3,10.62,7.65,10.62a8,8,0,0,0,4.49-1.37l1,2.45a10.21,10.21,0,0,1-6.3,1.73" />
                  <path d="M162.84,35.75c.48,6,3.76,9,8.9,9a14.66,14.66,0,0,0,6.88-1.55l1.08,2.59a18,18,0,0,1-8.22,1.73c-7.12,0-12.18-4.23-12.18-13.34,0-8.69,4.67-13.2,11-13.2s10.37,3.95,10.37,12.4Zm7.35-12.41c-4.1,0-7.56,3.2-7.52,10.29l14.39-2c0-5.87-2.81-8.32-6.87-8.32" />
                  <path d="M198.57,23.81V46.88H194.9V23.81h-3.76V21.56h3.76V17.9c0-4.61,2.72-7.95,8.08-7.95.39,0,.87.05.87.05v2.35h-.44c-2.54,0-4.84,1.64-4.84,5.12v4.09h5.28v2.25Z" />
                  <path d="M217.28,47.49c-7.47,0-10.89-5.78-10.89-13.24S209.81,21,217.28,21s10.85,5.82,10.85,13.3-3.37,13.24-10.85,13.24m0-24c-5.53,0-7.13,5.59-7.13,10.81s1.73,10.56,7.13,10.56,7.13-5.35,7.13-10.56-1.6-10.81-7.13-10.81" />
                  <path d="M244.08,23.91c-2.34-.61-5.75-.52-7.35.47v22.5H233V22.69c2.67-1.13,5.36-1.74,10.11-1.74H245Z" />
                  <path d="M277.42,47.13,263.07,25a32.2,32.2,0,0,1-1.85-3.29h-.09s.13,1.88.13,3.85V47.13h-4.71V14.8h5.31l13.61,20.82A28.76,28.76,0,0,1,277.38,39h.08s-.17-1.84-.17-3.77V14.8H282V47.13Z" />
                  <path d="M297.52,47.79c-7.43,0-10.93-3-10.93-7.81,0-6.8,7.12-8.64,15.59-9.39V29.13c0-3.47-2.37-4.51-5.83-4.51a18,18,0,0,0-6.87,1.46L288.23,23a24,24,0,0,1,9.12-1.83c5.61,0,9.93,2.3,9.93,8.78V46a22.71,22.71,0,0,1-9.76,1.83m4.66-14.67c-6.26.67-10.45,1.84-10.45,6.73,0,3.42,2.42,4.88,6.22,4.88a10.09,10.09,0,0,0,4.23-.84Z" />
                  <path d="M322,47.69c-5.31,0-7.34-3.43-7.34-6.86V25.09h-3.55V21.81h3.55V16.12l5.4-1.5v7.19H325v3.28h-5V40.55a3.26,3.26,0,0,0,3,3.52h.5a5.5,5.5,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52" />
                  <path d="M331.91,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.44V47.13h-5.44Z" />
                  <path d="M350.88,47.79c-7.73,0-11.57-5.74-11.57-13.3s3.84-13.34,11.57-13.34,11.54,5.78,11.54,13.34-3.8,13.3-11.54,13.3m0-23.17c-4.66,0-6.05,4.89-6.05,9.82s1.47,9.63,6.05,9.63,6.05-4.7,6.05-9.63-1.38-9.82-6.05-9.82" />
                  <path d="M382.52,47.13V29c0-3.24-2.77-4.47-5.88-4.47a12.3,12.3,0,0,0-4.37.76v21.8h-5.39V23a26.81,26.81,0,0,1,10.06-1.83c6.61,0,11,2.25,11,7.8V47.13Z" />
                  <path d="M403.18,47.79c-7.43,0-10.94-3-10.94-7.81,0-6.8,7.13-8.64,15.6-9.39V29.13c0-3.47-2.37-4.51-5.83-4.51a18,18,0,0,0-6.87,1.46L393.89,23A24,24,0,0,1,403,21.15c5.62,0,9.94,2.3,9.94,8.78V46a22.71,22.71,0,0,1-9.76,1.83m4.66-14.67c-6.27.67-10.46,1.84-10.46,6.73,0,3.42,2.43,4.88,6.23,4.88a10.09,10.09,0,0,0,4.23-.84Z" />
                  <polygon points="418.52 47.13 418.52 34.91 418.52 10.25 423.92 10.25 423.92 22.76 423.92 47.13 418.52 47.13" />
                  <path d="M445.39,47.79A19.11,19.11,0,0,1,436.58,46l1.51-4a13.48,13.48,0,0,0,6.22,1.55c3.76,0,6.44-2.21,6.44-5.41,0-7.09-13.44-4.36-13.44-14.42,0-5.13,4.15-9.59,10.72-9.59A15.82,15.82,0,0,1,455.8,16l-1.38,3.52a11.93,11.93,0,0,0-5.66-1.5c-3.5,0-5.79,2.11-5.79,5.12,0,7,13.74,3.94,13.74,14.65,0,5.74-4.71,10-11.32,10" />
                  <path d="M470.41,47.69c-5.31,0-7.34-3.43-7.34-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.92v3.28h-4.92V40.55a3.27,3.27,0,0,0,3,3.52h.48a5.12,5.12,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52" />
                  <path d="M487.27,47.79c-7.44,0-10.93-3-10.93-7.81,0-6.8,7.13-8.64,15.6-9.39V29.13c0-3.47-2.38-4.51-5.84-4.51a18,18,0,0,0-6.87,1.46L478,23a23.94,23.94,0,0,1,9.11-1.83c5.62,0,9.94,2.3,9.94,8.78V46a22.71,22.71,0,0,1-9.76,1.83M492,33.16c-6.27.67-10.46,1.84-10.46,6.73,0,3.42,2.42,4.88,6.22,4.88a10,10,0,0,0,4.24-.84Z" />
                  <path d="M511.73,47.69c-5.32,0-7.35-3.43-7.35-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.92v3.28h-4.92V40.55a3.26,3.26,0,0,0,3,3.52h.5a5.5,5.5,0,0,0,1.46-.23v3.33a7.69,7.69,0,0,1-3,.52" />
                  <path d="M521.66,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.45V47.13h-5.45Z" />
                  <path d="M536.19,47.79A15.9,15.9,0,0,1,528.54,46L530,42.48a10.53,10.53,0,0,0,5.52,1.5c2.77,0,5-1.78,5-3.94,0-6-11.1-3.2-11.1-11.47,0-3.76,3.37-7.42,8.86-7.42A13.56,13.56,0,0,1,545.34,23l-1.42,3.14a8.47,8.47,0,0,0-4.62-1.45c-2.81,0-4.54,1.69-4.54,3.62,0,5.64,11.32,3.14,11.32,11.6,0,4-3.85,7.9-9.89,7.9" />
                  <path d="M559.83,47.69c-5.31,0-7.35-3.43-7.35-6.86V25.09h-3.54V21.81h3.54V16.12l5.4-1.5v7.19h4.93v3.28h-4.93V40.55a3.27,3.27,0,0,0,3,3.52h.48a5.64,5.64,0,0,0,1.47-.23v3.33a7.72,7.72,0,0,1-3,.52" />
                  <path d="M569.77,17.43a3,3,0,0,1-3.15-2.81,3.17,3.17,0,0,1,6.31,0,3,3,0,0,1-3.16,2.81m-2.72,4.38h5.44V47.13h-5.44Z" />
                  <path d="M588.14,47.79c-6.23,0-11-5.08-11-13.35s4.88-13.29,11-13.29A10.51,10.51,0,0,1,594.66,23l-1.21,3a6.87,6.87,0,0,0-4-1.22c-4.4,0-6.69,3.81-6.69,9.49s2.63,9.59,6.61,9.59a6.74,6.74,0,0,0,4-1.28L594.7,46c-1.12.94-3.33,1.84-6.56,1.84" />
                  <path d="M605.1,47.79A15.9,15.9,0,0,1,597.45,46l1.42-3.47A10.54,10.54,0,0,0,604.4,44c2.77,0,5-1.78,5-3.94,0-6-11.1-3.2-11.1-11.47,0-3.76,3.37-7.42,8.85-7.42a13.49,13.49,0,0,1,7.1,1.83l-1.42,3.14a8.42,8.42,0,0,0-4.63-1.45c-2.8,0-4.53,1.69-4.53,3.62,0,5.64,11.32,3.14,11.32,11.6,0,4-3.85,7.9-9.89,7.9" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </Router>
  );
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// This is required as a workaround PropTypes and Query Strings
// By forcing a string on it, it's happy
function getString(key, query) {
  const val = query.get(key);

  if (val === null) {
    return "";
  }

  return "" + query.get(key);
}

function QueryRouting(props) {
  let query = useQuery();

  return (
    <Routes>
      <Route
        path="/"
        element={<Home authorisedActivities={props.authorisedActivities} />}
      />
      <Route
        path="/surveys"
        element={
          <Surveys
            authorisedActivities={props.authorisedActivities}
            flashMessageUntil={query.get("flashMessageUntil")}
          />
        }
      />
      <Route path="/createsurvey" element={<CreateSurvey />} />
      <Route
        path="/viewsurvey"
        element={<ViewSurvey surveyId={getString("surveyId", query)} />}
      />
      <Route
        path="/exportfiletemplates"
        element={
          <ExportFileTemplates
            authorisedActivities={props.authorisedActivities}
            flashMessageUntil={query.get("flashMessageUntil")}
          />
        }
      />
      <Route
        path="/createexportfiletemplate"
        element={<CreateExportFileTemplate />}
      />
      <Route path="/mygroupsadmin" element={<MyGroupsAdmin />} />
      <Route
        path="/groupadmin"
        element={
          <GroupAdmin
            groupId={getString("groupId", query)}
            groupName={getString("groupName", query)}
            flashMessageUntil={query.get("flashMessageUntil")}
            deletedUserEmail={getString("deletedUserEmail", query)}
            addedUserEmail={getString("addedUserEmail", query)}
          />
        }
      />
      <Route
        path="/deleteuserfromgroupconfirmation"
        element={
          <DeleteUserFromGroupConfirmation
            groupUserId={getString("groupUserId", query)}
            groupName={getString("groupName", query)}
            groupId={getString("groupId", query)}
            userEmail={getString("userEmail", query)}
          />
        }
      />
      <Route
        path="/addUsertogroup"
        element={
          <AddUserToGroup
            groupUserId={getString("groupUserId", query)}
            groupName={getString("groupName", query)}
            groupId={getString("groupId", query)}
            userEmail={getString("userEmail", query)}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

QueryRouting.propTypes = {
  authorisedActivities: PropTypes.array.isRequired,
};

export default App;
