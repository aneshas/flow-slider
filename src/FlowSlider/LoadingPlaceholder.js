import React, { useContext } from "react";
import { FlowItem } from "./FlowItem";
import { FlowContext } from "./FlowContext";

export const LoadingPlaceholder = ({ itemCount = 10, children }) => {
  const items = [];
  const flowContext = useContext(FlowContext);

  for (let i = 0; i < itemCount; i++) {
    items.push(
      <FlowItem style={flowContext.itemBaseStyle} key={i}>
        {children}
      </FlowItem>
    );
  }

  return <>{items}</>;
};
