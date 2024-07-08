export function onRequest(context) {
  /**
   * An object with different URLs to fetch
   * @param {Object} ORIGINS
   */

  const url = new URL(request.url);
  url.hostname = 'tenvexity.api.einsum.org';
  // If it is, proxy request to that third party origin
  return fetch(url.toString(), request);
}
