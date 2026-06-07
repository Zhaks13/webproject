export default defineConfig({
    plugins: [react()], // или что там у тебя
    server: {
        host: '0.0.0.0',
        port: 3000,
        allowedHosts: ['stolyarniy-dvor.shop', 'www.stolyarniy-dvor.shop']
    }
})