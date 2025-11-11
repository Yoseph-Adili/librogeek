import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv";

dotenv.config({path: "../.env"});
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: process.env.FRONTEND_PORT,
        host: true,
    },
    define: {
        "process.env.HOST": JSON.stringify(process.env.HOST),
        "process.env.BACKEND_PORT": JSON.stringify(process.env.BACKEND_PORT)
    }
})
