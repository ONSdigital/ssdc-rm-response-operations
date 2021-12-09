

function ComponentErrorPanel(props) {

    return (
        <div
            className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s"
            id={props.id}
        >
            <span className="ons-u-vh">Error: </span>
            <div className="ons-panel__body">
                <p className="ons-panel__error">
                    <strong>{props.errorSummary}</strong>
                </p>
                <div className="field">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default ComponentErrorPanel;