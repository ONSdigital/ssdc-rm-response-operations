import React, { forwardRef } from "react";

const TextInput = (props, ref) => (
    <div class="ons-field">
        <label class="ons-label" for="text" htmlFor={props.id}>{props.label} </label>
        <input type="text"
            id={props.id}
            class="ons-input ons-input--text ons-input-type__input"
            required={props.required}
            value={props.value}
            onChange={props.onChange}
            ref={ref}
        />
    </div>
)

export default forwardRef(TextInput);
