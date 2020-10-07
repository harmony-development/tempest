import { useEffect, useState, useCallback } from "react";

export const useScrollHandler = (props: {
  target: React.MutableRefObject<HTMLDivElement | null>;
  onScrollTop: () => void;
  enabled: boolean;
}) => {
  const { target, enabled, onScrollTop } = props;

  const onScroll = useCallback(() => {
    if (!enabled) return; // reached top
    if (target.current?.scrollTop === 0) {
      props.onScrollTop();
    }
  }, [enabled, target, onScrollTop]);

  useEffect(() => {
    target.current?.addEventListener("scroll", onScroll);
    return () => {
      target.current?.removeEventListener("scroll", onScroll);
    };
  }, [target, onScroll]);
};
