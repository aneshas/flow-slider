import React from "react";

const FlowControl = ({ children, clicked, appendClass = "" }) => {
  return (
    <button onClick={e => clicked(e)} className={`flowControl ${appendClass}`}>
      {children}
    </button>
  );
};

export const FlowPrev = props => (
  <FlowControl {...props} appendClass="flowPrev">
    ⮂
  </FlowControl>
);

export const FlowNext = props => (
  <FlowControl {...props} appendClass="flowNext">
    ⮀
  </FlowControl>
);
