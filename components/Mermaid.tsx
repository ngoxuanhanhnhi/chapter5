"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: true,
    theme: "dark",
    securityLevel: "loose",
    fontFamily: "Poppins",
    themeVariables: {
        primaryColor: "#2563eb",
        secondaryColor: "#4c1d95",
        tertiaryColor: "#10b981",
        mainBkg: "rgba(255, 255, 255, 0.05)",
        nodeBorder: "rgba(255, 255, 255, 0.1)",
        clusterBkg: "transparent",
        titleColor: "#f1f5f9",
        edgeColor: "#94a3b8",
    },
});

export default function Mermaid({ chart }: { chart: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            mermaid.contentLoaded();
        }
    }, [chart]);

    return (
        <div className="mermaid" ref={ref}>
            {chart}
        </div>
    );
}
