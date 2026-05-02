"use client";

import { useEffect } from "react";

const SCRIPT_SRC = "https://elevenlabs.io/convai-widget/index.js";
const SCRIPT_ID = "elevenlabs-convai-script";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { "agent-id"?: string },
        HTMLElement
      >;
    }
  }
}

export default function ConvaiWidget() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(SCRIPT_ID)) return;
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = SCRIPT_SRC;
    s.async = true;
    document.head.appendChild(s);
  }, []);

  if (!agentId) return null;
  return <elevenlabs-convai agent-id={agentId} />;
}

export function openConvaiWidget() {
  if (typeof document === "undefined") return;
  const el = document.querySelector("elevenlabs-convai") as HTMLElement | null;
  if (!el) return;
  const button = el.shadowRoot?.querySelector("button") as HTMLButtonElement | null;
  button?.click();
}
