export const parseHMC = (uri: string, defaultHost: string) => {
  if (uri.startsWith("hmc")) {
    const { host, pathname } = new URL(uri.replace("hmc", "https"));
    return `https://${host}/_harmony/media/download/${pathname.substr(1)}`;
  }
  return `${defaultHost}/_harmony/media/download/${encodeURIComponent(uri)}`;
};
