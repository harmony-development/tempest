export const resetObject = (obj: any) => {
  Object.keys(obj).forEach((k) => (obj[k] = undefined));
};
