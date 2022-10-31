/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: "jit",
    content: [
        "./src/**/*.tsx",
    ],
    theme: {
        extend: {
            colors: {
                "c-gray-50": "#EEEEEE",
                "c-gray-100": "#E8E8E8",
                "c-gray-200": "#F4F4F5",
                "c-gray-300": "#D4D4D8",
                "c-gray-500": "#71717A",
            },
        },
    },
    plugins: [],
}
