export const withPayload = <T>() => {
  return (t: T) => ({ payload: t });
};
