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
    <img src="/back.svg" alt="Back..." /> 
  </FlowControl>
);

export const FlowNext = props => (
  <FlowControl {...props} appendClass="flowNext">
    <img src="/next.svg" alt="Next..." /> 
  </FlowControl>
);
