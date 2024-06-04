import { getFetcher } from './get-fetcher';

/**
 * Fetches from a bound MFE.
 * @see https://developers.cloudflare.com/workers/platform/bindings/about-service-bindings/ for more information.
 *
 * @param env The CF environment bindings.
 * @param mfeName The name of the MFE to fetch.
 * @param request The request to forward to the MFE.
 */
export async function fetchMfe(
  env: Record<string, unknown>,
  mfeName: string,
  request: Request
) {
  const service = getFetcher(env, mfeName);
  const url = new URL(request.url);
  const response = await service.fetch(new Request(url, request));
  if (response.body === null) {
    throw new Error(`Response from "${mfeName}" request is null.`);
  }
  return response.body;
}
