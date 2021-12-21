import React, { useEffect } from "react";

function AutoSuggest(props) {

    useEffect(() => {
        const script = document.createElement("script");
        //TODO: This works, but...  us calling main.js everytime like this sustainable?
        // And should this version be a Variable somewhere?
        // At least stick this in a separate function somewhere, for reuse.
        script.src = "https://cdn.ons.gov.uk/sdc/design-system/44.1.2/scripts/main.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <div className="ons-grid ons-grid--gutterless">
            <div className="ons-grid__col ons-col-8@m">
                <div id="autosuggest-container"
                    className="ons-js-autosuggest   ons-autosuggest-input"
                    data-instructions="Use up and down keys to navigate suggestions once you&#39;ve typed more than two characters. Use the enter key to select a suggestion. Touch device users, explore by touch or with swipe gestures."
                    data-aria-you-have-selected="You have selected"
                    data-min-chars=""
                    data-aria-min-chars="Enter 3 or more characters for suggestions."
                    data-aria-one-result="There is one suggestion available."
                    data-aria-n-results="There are {n} suggestions available."
                    data-aria-limited-results="Results have been limited to 10 suggestions. Type more characters to improve your search"
                    data-more-results="Continue entering to improve suggestions"
                    data-results-title="Suggestions"
                    data-no-results="No suggestions found. You can enter your own answer"
                    data-type-more="Continue entering to get suggestions"
                    data-allow-multiple="true"
                    data-autosuggest-data={props.suggestionData}>
                    <div className="ons-field">
                        <label className="ons-label  ons-label--with-description "
                            htmlFor="autosuggest-label"
                            id="autosuggest-label">Email
                        </label>
                        <span id="autosuggest-label-description-hint"
                            className="ons-label__description  ons-input--with-description">
                            Select from suggestions
                        </span>
                        <input type="text" id="autosuggest-input"
                            className="ons-input ons-input--text ons-input-type__input ons-js-autosuggest-input "
                            autoComplete="off"
                            aria-describedby="autosuggest-label-description-hint" />
                    </div>
                    <div className="ons-autosuggest-input__results ons-js-autosuggest-results">
                        <header id="autosuggest-suggestions"
                            className="ons-autosuggest-input__results-title ons-u-fs-s">Suggestions
                        </header>
                        <ul className="ons-autosuggest-input__listbox ons-js-autosuggest-listbox"
                            role="listbox" id="autosuggest-listbox"
                            aria-labelledby="autosuggest-suggestions"
                            tabIndex="-1"></ul>
                    </div>
                    <div className="ons-autosuggest-input__instructions ons-u-vh ons-js-autosuggest-instructions"
                        id="autosuggest-instructions"
                        tabIndex="-1">Use up and down keys to navigate suggestions once you&#39;ve typed more than two characters. Use the enter key to select a suggestion. Touch device users, explore by touch or with swipe gestures.
                    </div>
                    <div className="ons-autosuggest-input__status ons-u-vh ons-js-autosuggest-aria-status"
                        aria-live="assertive" role="status" tabIndex="-1">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AutoSuggest;