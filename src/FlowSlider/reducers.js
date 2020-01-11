import { FlowState } from "./FlowState";

export const flowReducer = (state, action) => {
  switch (action.type) {
    case "CONTENT_RESIZED":
      return {
        ...state,
        contentWidth: action.contentWidth
      };

    case "CONTENT_REQUESTED":
      if (state.current !== FlowState.NEED_MORE) return state;

      return {
        ...state,
        current: FlowState.FETCHING
      };

    case "BATCH_LOADED":
      return {
        ...state,
        current: FlowState.IDLE
      };

    case "COMPLETE":
      return {
        ...state,
        current: FlowState.COMPLETED
      };

    case "MOVE_NEXT":
      const newOffset = state.itemsOffset - state.contentWidth;
      const nextOffset =
        Math.abs(newOffset) >= action.itemsWidth
          ? state.itemsOffset
          : newOffset;

      return move(state, action.itemsWidth, nextOffset);

    case "MOVE_PREV":
      const offset = state.itemsOffset + state.contentWidth;
      const prevOffset = offset >= 0 ? 0 : offset;

      return move(state, action.itemsWidth, prevOffset);

    default:
      return state;
  }
};

const move = (state, itemsWidth, nextOffset) => ({
  ...checkThreshold(state, itemsWidth, nextOffset),
  itemsOffset: nextOffset
});

const checkThreshold = (state, itemsWidth, itemsOffset) => {
  if (
    state.current === FlowState.COMPLETED ||
    state.current === FlowState.FETCHING
  )
    return state;

  const x = Math.abs(itemsOffset) + state.contentWidth;

  if (itemsWidth - x < state.contentWidth + state.threshold) {
    console.log("time to load more");

    return {
      ...state,
      current: FlowState.NEED_MORE
    };
  }

  return state;
};
