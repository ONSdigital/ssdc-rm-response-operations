import React from "react";

function RadioBtnGroup(props) {
    return (
        <div class="ons-question ons-u-mt-no">
            <fieldset class="ons-fieldset" onChange={props.onChange}>
                <legend class="ons-fieldset__legend">
                    <h1 id="fieldset-legend-title" class="ons-fieldset__legend-title ">{props.legend}</h1>
                </legend>
                <div class="ons-input-items">
                    <div class="ons-radios__items">
                        {props.children}
                    </div>
                </div>
            </fieldset>
        </div>
    );
}

export default RadioBtnGroup;