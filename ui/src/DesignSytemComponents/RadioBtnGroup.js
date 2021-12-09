import React, { forwardRef } from "react";

const RadioBtnGroup =(props, ref) => {
    return (
        <div class="ons-question ons-u-mt-no">
            <fieldset class="ons-fieldset" ref={ref} onChange={props.onChange}>
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

export default forwardRef(RadioBtnGroup);