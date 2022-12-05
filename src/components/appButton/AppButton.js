import React from "react";
import "./appButton.css";

function AppButton({ action, title, buttonClass }) {
  return (
    <button className={buttonClass} onClick={action}>
      {title}
    </button>
  );
}

export default AppButton;
