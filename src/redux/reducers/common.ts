export const withPayloadType = <T>() => {
  return (t: T) => ({ payload: t });
};
