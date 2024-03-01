import type {
  Frame as FramesJsFrame,
  FrameFlattened as FramesJsFrameFlattened,
} from "frames.js";

export type Frame = Omit<FramesJsFrame, "postUrl"> & { postUrl?: string };
export type FrameFlattened = Omit<
  FramesJsFrameFlattened,
  "fc:frame:post_url"
> & { "fc:frame:post_url"?: string };

export const flattenFrame = (frame: Frame): FrameFlattened => ({
  "fc:frame": frame.version,
  "fc:frame:image": frame.image,
  ...(frame.postUrl ? { "fc:frame:post_url": frame.postUrl } : {}),
  "fc:frame:input:text": frame.inputText,
  ...(frame.imageAspectRatio
    ? { [`fc:frame:image:aspect_ratio`]: frame.imageAspectRatio }
    : {}),
  ...frame.buttons?.reduce(
    (acc, button, index) => ({
      ...acc,

      [`fc:frame:button:${index + 1}`]: button.label,
      [`fc:frame:button:${index + 1}:action`]: button.action,
      [`fc:frame:button:${index + 1}:target`]: button.target,
    }),
    {},
  ),
  ...(frame.accepts?.map(
    ({ id, version }) => `<meta name="of:accepts:${id}" content="${version}"/>`,
  ) ?? []),
});
