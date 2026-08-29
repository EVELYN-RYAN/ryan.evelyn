export interface GeoResult {
  country?: string;
  city?: string;
}

const PRIVATE_IP_PREFIXES = ["127.", "10.", "192.168.", "::1"];

export async function lookupGeo(ip: string): Promise<GeoResult> {
  if (ip === "unknown" || PRIVATE_IP_PREFIXES.some((prefix) => ip.startsWith(prefix))) {
    return {};
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`, {
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return {};
    const data = await res.json();
    if (data.status !== "success") return {};
    return { country: data.country, city: data.city };
  } catch {
    return {};
  }
}
