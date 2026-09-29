// File: postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Ubah nama dari "tailwindcss" menjadi "@tailwindcss/postcss"
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
export default config;