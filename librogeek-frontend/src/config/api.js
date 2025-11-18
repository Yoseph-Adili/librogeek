const HOST = process.env.HOST;
const BACKEND_PORT =  process.env.BACKEND_PORT;

export const API_URL = `${HOST}:${BACKEND_PORT}/api`;
export const STATIC_URL = `${HOST}:${BACKEND_PORT}`;
