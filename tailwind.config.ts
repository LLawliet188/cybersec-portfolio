import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#020107",
        "base-soft": "#080512",
        "base-panel": "#120A1C",
        accent: "#A78BFA",
        interactive: "#FF4FD8",
        violet: "#7C3AED",
        ember: "#FF6B9A",
        aurora: "#6EE7F9",
        success: "#DFFF6A",
        primary: "#FAF7FF",
        secondary: "#B8ABC8",
        muted: "#6B5F78",
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
        cyan: "0 0 34px rgba(255, 79, 216, 0.22)",
        "cyan-sm": "0 0 18px rgba(110, 231, 249, 0.16)",
        "panel-depth":
          "0 34px 100px rgba(2, 1, 8, 0.76), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        "violet-soft": "0 0 44px rgba(167, 139, 250, 0.2)",
      },
      backgroundImage: {
        "cta-gradient":
          "linear-gradient(135deg, rgba(223,255,106,0.96), rgba(255,79,216,0.78))",
        "heading-gradient":
          "linear-gradient(135deg, #FFFFFF 4%, #E9D5FF 28%, #FF4FD8 62%, #6EE7F9 100%)",
        "panel-gradient":
          "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.016))",
      },
    },
  },
  plugins: [],
};

export default config;
