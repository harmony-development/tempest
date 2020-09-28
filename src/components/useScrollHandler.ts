import { useEffect, useState } from "react";

export const useScrollHandler = (props: {
  target: React.MutableRefObject<HTMLDivElement | null>;
  onScrollTop: () => void;
  enabled: boolean;
}) => {
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
  const [previousScrollTop, setPreviousScrollTop] = useState(0);
  const [scrollTrigger, setScrollTrigger] = useState(false);

  useEffect(() => {
    props.target.current?.addEventListener("scroll", () => {
      if (!props.enabled) return; // reached top presumably
      if (props.target.current?.scrollTop === 0) {
        setScrollTrigger(true);
        setPreviousScrollHeight(props.target.current?.scrollHeight);
        setPreviousScrollTop(props.target.current.scrollTop);
        props.onScrollTop();
      }
    });
  }, []);
};
