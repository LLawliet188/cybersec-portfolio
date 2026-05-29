import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#05040A",
        "base-soft": "#0D0717",
        "base-panel": "#140B22",
        accent: "#8B5CF6",
        interactive: "#38BDF8",
        violet: "#A855F7",
        ember: "#FB7185",
        aurora: "#22D3EE",
        success: "#B7FF2A",
        primary: "#F8F5FF",
        secondary: "#B8A9CC",
        muted: "#655875",
        glass: "rgba(255,255,255,0.03)",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        signal: "0.14em",
      },
      boxShadow: {
        cyan: "0 0 34px rgba(168, 85, 247, 0.26)",
        "cyan-sm": "0 0 18px rgba(56, 189, 248, 0.18)",
        "panel-depth":
          "0 34px 100px rgba(2, 1, 8, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        "violet-soft": "0 0 44px rgba(168, 85, 247, 0.24)",
      },
      backgroundImage: {
        "cta-gradient":
          "linear-gradient(135deg, rgba(183,255,42,0.96), rgba(56,189,248,0.88))",
        "heading-gradient":
          "linear-gradient(135deg, #FFFFFF 4%, #DDD6FE 28%, #A855F7 62%, #38BDF8 100%)",
        "panel-gradient":
          "linear-gradient(145deg, rgba(255,255,255,0.085), rgba(255,255,255,0.018))",
      },
    },
  },
  plugins: [],
};

export default config;
