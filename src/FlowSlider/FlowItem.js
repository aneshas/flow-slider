import React from "react";

export const FlowItem = props => {

  return (
    <div
      className="flowItem"
      {...props}
    >
      {props.children}
    </div>
  );
};
