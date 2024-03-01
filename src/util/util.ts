import { twMerge } from "tailwind-merge";
import { cx } from "class-variance-authority";

export const twMergeClsx = (...inputs: Array<Parameters<typeof cx>[0]>) =>
  twMerge(cx(inputs));
