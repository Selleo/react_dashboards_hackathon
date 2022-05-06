import { useLayoutEffect, useState } from "react";

export default function useGetContainerSize({ containerRef }) {
  const [containerSize, setContainerSize] = useState(null);
  const getContainerSize = () => ({
    height: containerRef.current?.clientHeight || 0,
    width: containerRef.current?.clientWidth || 0,
  });

  const calculateSize = () => {
    if (containerSize?.height) {
      return
    }

    const size = getContainerSize();
    if (!!size.height) {
      setContainerSize(size);
    } else {
      setTimeout(calculateSize, 10);
    }
  };
  useLayoutEffect(() => {
    calculateSize();
  }, []);

  return { containerSize };
}
