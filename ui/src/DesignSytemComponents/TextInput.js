import React from "react";

function TextInput(props) {
    const className = "ons-input ons-input--text ons-input-type__input"

    // TODO: REF not working for focus. https://reactjs.org/docs/forwarding-refs.html  
    // It can work, can't be passed as a prop though.  However I didn't get it to work 1st time
    // Ref required to focus,  and to add error panels..
    // might be able to lob error panels in here directly with any luck,to save on code;
    // but suspect we'll still need ref for focus

    return (
        <div class="ons-field">
            <label class="ons-label" for="text" htmlFor={props.id}>{props.label} </label>
            <input type="text"
                id={props.id}
                class={className}
                required={props.required}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    );

}

export default TextInput;

