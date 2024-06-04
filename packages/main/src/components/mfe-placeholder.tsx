import { fetchMfe } from '@/lib/fetch-mfe';
import { component$, SSRStream, useServerData } from '@builder.io/qwik';

/**
 * Requests a MFE, decode the result chunks and streams the response.
 *
 * This is the way to include a MFE in a Qwik Cloudflare application.
 */
export const MfePlaceholder = component$(({ name }: { name: string }) => {
  const env = useServerData<Record<string, unknown>>('env')!;
  const request = useServerData<Request>('request')!;
  const decoder = new TextDecoder();
  return (
    <SSRStream>
      {async (streamWriter) => {
        const mfeResponseBody = await fetchMfe(env, name, request);
        const readerStream = mfeResponseBody.getReader();
        let mfeChunk = await readerStream.read();
        while (!mfeChunk.done) {
          streamWriter.write(decoder.decode(mfeChunk.value));
          mfeChunk = await readerStream.read();
        }
      }}
    </SSRStream>
  );
});
