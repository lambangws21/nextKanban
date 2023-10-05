/** @format */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#53577d",
        secondary: "#3a3d57",
        thirdColor: "#4f6f7d",
        ActionColor: "#614f7d",
      },
    },
  },
  plugins: [],
};
export default config;
