import React, { useContext } from "react";
import { FlowContext } from "./FlowContext";

export const FlowItemFocus = ({ children }) => {
  const flowContext = useContext(FlowContext);

  return (
    <div
      className="itemFocused"
      style={{
        padding: flowContext.itemBaseStyle.padding
      }}
    >
      {children}
    </div>
  );
};
