import { $, PrefetchGraph, component$, useSignal } from "@builder.io/qwik";
import { Paragraph } from "./components/Paragraph";

export default component$(() => {
  const showText = useSignal(false);
  const onClick$ = $(() => {
    showText.value = !showText.value;
  });
  return (
    <div>
      <PrefetchGraph base="/_mfe/body/build/" />
      <h2>Body</h2>
      <button onClick$={onClick$}>Toggle</button>
      {showText.value && <Paragraph text="Some extra text" />}
    </div>
  );
});
