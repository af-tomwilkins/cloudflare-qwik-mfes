import {
  $,
  PrefetchGraph,
  PrefetchServiceWorker,
  component$,
  useOnDocument,
} from "@builder.io/qwik";
import { MfePlaceholder } from "./components/mfe-placeholder";

export default component$(() => {
  useOnDocument(
    "qprefetch",
    $((event) => {
      console.log(event);
    })
  );

  return (
    <>
      <head>
        <PrefetchServiceWorker verbose base="/" />
        <PrefetchGraph base="/_mfe/main/build/" />
      </head>
      <body>
        <h1>Main</h1>
        <MfePlaceholder name="body" />
      </body>
    </>
  );
});
