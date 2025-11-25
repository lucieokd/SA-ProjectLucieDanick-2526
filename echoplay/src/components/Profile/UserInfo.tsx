import React, { useState, useEffect, useRef, useContext } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { ThemeContext } from "./theme-context";

const userinfo = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const handleChangeMode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    console.log(`${newTheme === "dark" ? "Dark" : "Light"} mode ingeschakeld`);
  };

  const handleCredentialsChange = (e) => {
    e.preventDefault();
    //
  };

  return (
    <div className="">
      <form onChange={handleCredentialsChange}>
        <label content="Name">Voornaam: </label>
        <input type="text" placeholder="Voornaam" name="ChangeVoornaam" />
        <label htmlFor="">Achternaam: </label>
        <input type="text" placeholder="Achternaam" name="ChangeAchternaam" />
        <label htmlFor="">Email: </label>
        <input type="text" placeholder="Email" name="ChangeEmail" />
        <div className="ChangeBirthdate">
          <label htmlFor="">Geboortedatum: </label>
          <input type="number" min={1} max={31} placeholder="Dag" name="" />
          <input type="number" min={1} max={12} placeholder="maand" name="" />
          <input
            type="number"
            min={1850}
            max={2025}
            placeholder="jaar"
            name=""
          />
        </div>
        <button type="submit" value="Verander credentials" />
      </form>
      <div>
        <label htmlFor="">Change Mode</label>
        <button type="button" onClick={handleChangeMode}>
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </div>
  );
};

export default userinfo;
