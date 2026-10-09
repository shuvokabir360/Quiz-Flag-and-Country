/**
 * Utility functions for resolving static assets and flag URLs properly
 * in both local development and subpath deployments like GitHub Pages (/Quiz-Flag-and-Country/).
 */

/**
 * Returns a proper URL for any asset in the public/ folder.
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Strip leading slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  return `${cleanBase}${cleanPath}`;
}

/**
 * Resolves a country flag SVG URL.
 * Accepts either:
 * - Country code string (e.g. "bd", "US", "flags/bd.svg")
 * - Country object with code and/or flagUrl
 */
export function getFlagUrl(
  countryOrCode: string | { code?: string; flagUrl?: string } | null | undefined
): string {
  if (!countryOrCode) return '';

  if (typeof countryOrCode === 'object') {
    if (
      countryOrCode.flagUrl &&
      (countryOrCode.flagUrl.startsWith('http://') ||
        countryOrCode.flagUrl.startsWith('https://') ||
        countryOrCode.flagUrl.startsWith('data:'))
    ) {
      return countryOrCode.flagUrl;
    }
    const code = countryOrCode.code || '';
    if (!code) return '';
    return getFlagUrl(code);
  }

  // If already an absolute external URL or data URL
  if (
    countryOrCode.startsWith('http://') ||
    countryOrCode.startsWith('https://') ||
    countryOrCode.startsWith('data:')
  ) {
    return countryOrCode;
  }

  // Extract pure 2-letter ISO code if a path like "/flags/us.svg" was passed
  const match = countryOrCode.match(/([a-zA-Z]{2})\.svg$/);
  const code = match ? match[1].toLowerCase() : countryOrCode.toLowerCase().trim();

  return getAssetUrl(`flags/${code}.svg`);
}
