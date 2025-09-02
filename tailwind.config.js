/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,tsx}"],
    theme: {
        extend: {
            keyframes: {
                
                'open-menu': {
                    '0%': { transform: 'scaleY(0)'},
                    '80%': { transform: 'scaleY(1.2)'},
                    '100%': { transform: 'scaleY(1)'},
                },
            },
            animation: {
                'open-menu': 'open-menu 0.5s ease-in-out forwards',
            },
        },
        // gridTemplateColumns: {
        //     'auto-fill': 'repeat(auto-fill, minmax(33.33%, 1fr))'
        //   },
        fontFamily: {
          raleway: ['Raleway','sans-serif'],
          roboto: ['Roboto','sans-serif']
        },
    },
    plugins: [
    ],
    corePlugins: {
        preflight: false,
    },
    // purge: {
    //     content: ["./src/**/*.{html,js,jsx,tsx}"],
    //     safelist: [
    //         'border-sky-500',
    //       ]
    // },
    important: '#root',
};
