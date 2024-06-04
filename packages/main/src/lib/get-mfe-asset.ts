import { getFetcher } from './get-fetcher';

/**
 * Attempt to get an asset hosted by a MFE service.
 *
 * Such asset requests start with `/_mfe/{service-name}/`, which enables us
 * to choose the appropriate service binding and delegate the request there.
 * @param env The environment object from Cloudflare.
 * @param request The request to handle.
 * @param transformResponse An optional function to transform the raw response.
 */
export async function tryGetMfeAsset(
  env: Record<string, unknown>,
  request: Request,
  transformResponse: (request: Response) => Response = (r) => r
) {
  const url = new URL(request.url);
  const match = /^\/_mfe\/([^/]+)(\/.*)$/.exec(url.pathname);
  if (match === null) {
    return null;
  }
  const serviceName = match[1];
  const service = getFetcher(env, serviceName);
  const response = await service.fetch(
    new Request(new URL(match[2], request.url), request)
  );

  return transformResponse(response);
}
