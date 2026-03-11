"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
    fontFamily: "Inter",
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
        padding: 15,
        nodeSpacing: 30,
        rankSpacing: 40,
    },
    themeVariables: {
        primaryColor: "#2563eb",
        secondaryColor: "#4c1d95",
        tertiaryColor: "#10b981",
        mainBkg: "rgba(255, 255, 255, 0.05)",
        nodeBorder: "rgba(255, 255, 255, 0.1)",
        clusterBkg: "transparent",
        titleColor: "#f1f5f9",
        edgeColor: "#94a3b8",
        fontSize: "13px",
    },
});

export default function Mermaid({ chart }: { chart: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);
    const idRef = useRef(`mermaid-${Math.floor(Math.random() * 1000000)}`);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const renderChart = async () => {
            if (ref.current && chart) {
                try {
                    const { svg } = await mermaid.render(idRef.current, chart);
                    // Parse SVG string to modify root node attributes safely
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(svg, "image/svg+xml");
                    const svgElement = doc.documentElement;
                    
                    if (svgElement.tagName.toLowerCase() === 'svg') {
                        svgElement.removeAttribute("height");
                        svgElement.style.maxWidth = "100%";
                        svgElement.style.height = "auto";
                        svgElement.style.display = "block";
                        svgElement.style.margin = "auto";
                        setSvg(svgElement.outerHTML);
                    } else {
                        // fallback
                        setSvg(svg);
                    }
                } catch (error: any) {
                    console.error("Mermaid Render Error:", error);
                    setSvg(`<div style="color:red; background: white; padding: 10px; border-radius: 8px;">Mermaid Error: ${error.message || error}</div>`);
                }
            }
        };

        renderChart();
    }, [chart, isMounted]);

    if (!isMounted) return <div className="mermaid-placeholder" style={{ height: '300px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}></div>;

    return (
        <div 
            ref={ref} 
            className="mermaid-wrapper w-full h-full flex justify-center items-center overflow-visible"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
