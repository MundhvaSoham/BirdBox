/** @type {import('next').NextConfig} */
const nextConfig = {

  // Enable React Strict Mode   
    reactStrictMode: true,  
  
  // Define allowed image domains   
    images: {    
      domains: ["public-files.gumroad.com", "qqhuhpdwqoguhxekruva.supabase.co"],
  
  // Map relative /frontend/public/ paths to localhost  
    remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost:3000',   
          pathname: '/frontend/public/**'   
        }      
      ]   
    },
  };
  
  module.exports = nextConfig;