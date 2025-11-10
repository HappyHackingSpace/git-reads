import { generateHeadingId } from "./generateHeadingId";

export function createHeadingComponent(tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ({ ...props }: any) => {
      const text = String(props.children);
      const id = generateHeadingId(text);
      const HeadingTag = tag;
      return <HeadingTag id={id} {...props} />;
    };
  }