/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@fullcalendar/react',
    '@fullcalendar/daygrid',
    '@fullcalendar/interaction',
    '@fullcalendar/timegrid'
  ],
};

export default nextConfig;