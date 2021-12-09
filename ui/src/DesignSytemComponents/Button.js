
function Button(props) {
    const className = "ons-btn" +
        (props.secondary ? " ons-btn--secondary" : "") +
        (props.small ? " ons-btn--small" : "");

    const buttonType = (props.type ? props.type : "button");

    const buttonFragment = (
        <button type={buttonType} className={className} onClick={props.onClick}>
            <span className="ons-btn__inner" >{props.children}</span>
        </button>
    );

    // TODO: Do we need this at the moment? Design system not clear
    // This should only be used to link to a new page, with a url provided
    const linkButtonWithArrow = (
        <a href={props.url} role="button" class="ons-btn ons-btn--link ons-js-submit-btn">
            <span class="ons-btn__inner">{props.children}
                <svg class="ons-svg-icon ons-u-ml-xs" viewBox="0 0 8 13" xmlns="http://www.w3.org/2000/svg" focusable="false" fill="currentColor">
                    <path d="M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z" transform="translate(-5.02 -1.59)" />
                </svg>
            </span>
        </a>
    );

    return (
        <>
            {props.linkBtn ? linkButtonWithArrow : buttonFragment}
        </>
    );

}

export default Button;