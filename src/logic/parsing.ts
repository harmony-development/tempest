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
