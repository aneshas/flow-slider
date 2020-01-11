import { useEffect, useRef, useState } from "react";

export const useElementWidth = () => {
  const [width, setWidth] = useState(0);

  const ref = useRef();

  useEffect(() => {
    const setContanerWidth = () => setWidth(ref.current.offsetWidth);

    setContanerWidth();

    window.addEventListener("resize", setContanerWidth);

    return () => window.removeEventListener("resize", setContanerWidth);
  }, [ref]);

  return [width, ref];
};
