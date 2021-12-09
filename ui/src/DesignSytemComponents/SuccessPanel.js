function SuccessPanel(props) {

    return (
        <>
            <br />
            <br />
            <div class="ons-panel ons-panel--success ons-panel--no-title" id={props.id}>
                <span class="ons-u-vh">Completed: </span>
                <span class="ons-panel__icon ons-u-fs-r">
                    <svg class="ons-svg-icon " viewBox="0 0 13 10" xmlns="http://www.w3.org/2000/svg" focusable="false" fill="currentColor">
                        <path d="M14.35,3.9l-.71-.71a.5.5,0,0,0-.71,0h0L5.79,10.34,3.07,7.61a.51.51,0,0,0-.71,0l-.71.71a.51.51,0,0,0,0,.71l3.78,3.78a.5.5,0,0,0,.71,0h0L14.35,4.6A.5.5,0,0,0,14.35,3.9Z" transform="translate(-1.51 -3.04)" />
                    </svg>
                </span>
                <div class="ons-panel__body">{props.children}
                </div>
            </div>
            <br />
        </>
    )
}

export default SuccessPanel;
