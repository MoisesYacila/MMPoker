// import.meta.env.MODE is provided by Vite to determine the current environment
const isProd = import.meta.env.MODE === "production";

// Log and error messages only in non-production environments
export const log = (...args) => {
    if (!isProd) console.log(...args);
};

export const errorLog = (...args) => {
    if (!isProd) console.error(...args);
};
