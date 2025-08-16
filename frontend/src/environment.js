let IS_PROD = true;

const server = IS_PROD
    ? "https://nexcallbackend-a71c.onrender.com"
    : "http://localhost:8000";

export default server;
