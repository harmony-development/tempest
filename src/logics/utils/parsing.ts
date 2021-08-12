/**
 * Attempts to parse a user's selected host option as accurately as possible
 *
 * @returns a correctly formatted host string
 *
 * @author Bluskript
 */
export function parseUserHost(host: string): string {
  const protocol = host.includes("http://") ? "http" : "https";

  if (!host.includes("://")) host = `${protocol}://${host}`;

  const parsed = new URL(host);

  return `${parsed.protocol}//${parsed.hostname}:${parsed.port || 2289}`;
}

export function parseHarmonyURI(
  uri: string,
  defaultHost: string
): { host: string; code: string } {
  if (uri.startsWith("harmony://")) {
    const { host, pathname } = new URL(uri.replace("harmony", "https"));
    return { host, code: pathname.substr(1) };
  }
  return { host: defaultHost, code: uri };
}

export function parseHMC(uri: string, defaultHost: string) {
  if (uri.startsWith("hmc")) {
    const { host, pathname } = new URL(uri.replace("hmc", "https"));
    return `https://${host}/_harmony/media/download/${pathname.substr(1)}`;
  }
  return `${defaultHost}/_harmony/media/download/${encodeURIComponent(uri)}`;
}

function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export function parseLinks(text: string) {
  return text.split(/\s+/).filter((v) => isValidHttpUrl(v));
}
