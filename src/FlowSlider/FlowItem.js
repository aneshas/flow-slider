import React, { useState, useContext } from "react";
import { FlowContext } from "./FlowContext";

export const FlowItem = props => {
  const [popupVisible, setPopupVisible] = useState(false);
  const flowContext = useContext(FlowContext);

  const toggleVisibility = () => setPopupVisible(old => !old);

  return (
    <div
      className="flowItem"
      {...props}
      onMouseEnter={() => toggleVisibility()}
      onMouseLeave={() => toggleVisibility()}
    >
      {props.children}
      <div
        className="itemPopup"
        style={{
          opacity: popupVisible ? "1.0" : "0.0",
          padding: flowContext.itemBaseStyle.padding
        }}
      >
        <img src={`https://picsum.photos/520/364/?a`} alt="placeholder" />
      </div>
    </div>
  );
};
