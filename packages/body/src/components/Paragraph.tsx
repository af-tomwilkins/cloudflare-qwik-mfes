import { component$ } from "@builder.io/qwik";

export const Paragraph = component$<ParagraphProps>(({ text }) => {
  return <p>{text}</p>;
});

export interface ParagraphProps {
  text: string;
}
