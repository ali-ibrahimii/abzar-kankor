import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // فونت موردنظر خودت را جایگزین کن
      },
    },
  },
  plugins: [],
};

export default config;
