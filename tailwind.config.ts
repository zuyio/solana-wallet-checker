import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                neon: {
                    green: "#0f0", // A classic bright green
                    blue: "#00f3ff", // Electric cyan
                    pink: "#ff00ff", // Hot pink
                    purple: "#bf00ff",
                },
                cyber: {
                    black: "#050505",
                    dark: "#0a0a0a",
                    gray: "#1a1a1a",
                    grid: "#2a2a2a",
                }
            },
            backgroundImage: {
                'cyber-grid': "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
            },
        },
    },
    plugins: [],
};
export default config;
