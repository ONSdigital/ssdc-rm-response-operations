import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function CreateSurvey() {
  const [value, setValue] = useState("");

  function handleValueChange(event) {
    setValue(event.target.value);
  }

  let history = useHistory();

  async function createSurvey(event) {
    event.preventDefault();
    const newSurvey = {
      name: value,
    };

    const response = await fetch("/api/surveys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSurvey),
    });

    if (response.ok) {
      history.push(`/surveys?flashMessageUntil=${Date.now() + 5000}`);
    }
  }

  return (
    <>
      <h2>Create a New Survey</h2>
      <form onSubmit={createSurvey}>
        <div className="field">
          <label className="label venus" for="search">
            Enter a survey name
          </label>
          <input
            className="input input--text input-type__input"
            type="text"
            required
            value={value}
            onChange={handleValueChange}
          />
        </div>

        <p></p>
        <button type="submit" className="btn btn--link">
          <span className="btn__inner">Create Survey</span>
        </button>
      </form>
    </>
  );
}

export default CreateSurvey;
