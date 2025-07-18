const ORIGIN = 'https://output.circle-artifacts.com';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(originalRequest) {
  const originalUrl = new URL(originalRequest.url);

  // Build base proxy URL
  const proxyUrl = new URL(ORIGIN);
  proxyUrl.pathname = originalUrl.pathname;

  let response = await fetch(proxyUrl.toString(), originalRequest);

  // If the requested path is not found, attempt fallback paths
  if (response.status === 404) {
    const fallbackUrls = generateFallbackPaths(originalUrl.pathname);
    for (const fallbackPath of fallbackUrls) {
      proxyUrl.pathname = fallbackPath;
      const fallbackResponse = await fetch(proxyUrl.toString(), originalRequest);
      if (fallbackResponse.status !== 404) {
        return fallbackResponse;
      }
    }
    // If none of the fallbacks work, return original 404
    return response;
  }

  return response;
}

function generateFallbackPaths(pathname) {
  let paths = [];

  // Strip trailing slashes for consistency
  const cleanPath = pathname.replace(/\/+$/, '');

  // Try /foo/bar/index.html
  paths.push(`${cleanPath}/index.html`);

  // Optionally try .html version of the path: /foo/bar.html
  paths.push(`${cleanPath}.html`);

  return paths;
}
