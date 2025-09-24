// tailwind.config.js
const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // single component styles
        "./node_modules/@heroui/theme/dist/components/button.js",
        // or you can use a glob pattern (multiple component styles)
        './node_modules/@heroui/theme/dist/components/(button|snippet|code|input).js'
    ],
    theme: {
        extend: {
            colors: {
                white: "#FFFFFF",
                black: "#000000",
                blue: {
                    50: "#e6f1fe",
                    100: "#cce3fd",
                    200: "#99c7fb",
                    300: "#66aaf9",
                    400: "#338ef7",
                    500: "#006FEE",
                    600: "#005bc4",
                    700: "#004493",
                    800: "#002e62",
                    900: "#001731",
                },
                secondary: "#f15f33"
            },
        },
    },
    darkMode: "class",
    plugins: [heroui()],
};