import Link from "next/link";

import { flattenFrame } from "~/util/frames";

import type { Metadata } from "next";
import type { Frame } from "~/util/frames";

const OG_IMAGE_API_BASE_URL = "https://util.softwaredeveloper.ninja";
const imageUrl = new URL(`${OG_IMAGE_API_BASE_URL}/api/og/image`);
imageUrl.search = new URLSearchParams({
  theme: "dark",
  content: JSON.stringify({
    style: { fontSize: 36, fontWeight: 700 },
    data: ["Demo: Sign in from a frame!"],
  }),
}).toString();

const initialFrame: Frame = {
  image: imageUrl.toString(),
  version: "vNext",
  buttons: [
    {
      label: "Sign In",
      action: "link",
      target: `${process.env.BASE_URL}/api/frames/siwe`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Demo: Sign In From a Frame",
  description: "Create an account or sign in from a frame experiment.",
  openGraph: {
    images: [
      {
        url: imageUrl.toString(),
      },
    ],
  },
  other: flattenFrame(initialFrame),
};

export default function SiweFrame() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Link
        href="/api/frames/siwe"
        className="text-xl font-medium underline-offset-4 hover:underline"
      >
        Sign In
      </Link>
    </main>
  );
}
