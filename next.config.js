/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
//https://arweave.net/A8ajFoVm3D71hb5JgYM-pvaDfD6JV4xU9ESloA-aR7o?ext=png)
module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'arweave.net',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '**',
            }
        ],

    },
}