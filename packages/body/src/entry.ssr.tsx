import { StreamWriter } from "@builder.io/qwik";
import Root from "./root";
import { renderToStream } from "@builder.io/qwik/server";
import { manifest } from "@qwik-client-manifest";

export default {
  async fetch(
    request: Request,
    env: Record<string, string>
  ): Promise<Response> {
    const { writable, readable } = new TransformStream();
    const response = new Response(readable, {
      headers: {
        "Content-Type": "text/html",
      },
    });
    const stream = new SimpleStreamWriter(writable);
    const mfeBasePath = `/_mfe/body/`;

    renderToStream(<Root />, {
      streaming: {
        inOrder: {
          strategy: "auto",
        },
      },
      manifest,
      containerTagName: "div",
      containerAttributes: {
        style: "border: 1px dotted green;padding: 1em;",
      },
      debug: true,
      stream,
      serverData: { request, env, mfeBasePath },
      qwikLoader: { include: "auto" },
      base: mfeBasePath + "build/",
    }).finally(() => {
      stream.close();
    });
    return response;
  },
};

/**
 * Writes encoded text chunks to a `WritableStream`.
 * It safely handles both `string` and `Uint8Array` chunks.
 */
export class SimpleStreamWriter implements StreamWriter {
  private writer = this.writable.getWriter();
  private encoder = new TextEncoder();
  constructor(private writable: WritableStream) {}

  write(chunk: string | Uint8Array) {
    this.writer.write(
      typeof chunk === "string" ? this.encoder.encode(chunk) : chunk
    );
  }

  close() {
    this.writer.close();
  }
}
