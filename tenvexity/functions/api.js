export function onRequest({ request }) {
  /**
   * An object with different URLs to fetch
   * @param {Object} ORIGINS
   */

  const url = new URL(request.url);
  url.hostname = 'tenvexity.api.einsum.org';

  // Create a new request based on the original one
  const init = {
    body: request.body,
    headers: request.headers,
    method: request.method,
  };

  const newRequest = new Request(url, init);

  // If it is, proxy request to that third party origin
  return fetch(newRequest);
}
