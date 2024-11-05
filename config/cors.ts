import type { CorsConfig } from "@ioc:Adonis/Core/Cors";

const corsConfig: CorsConfig = {
  enabled: true, // Enable CORS for all requests

  // Set allowed origins explicitly
  origin: ["http://localhost:3000", "http://127.0.0.1:3333"], // Allow specific origins

  methods: ["get", "HEAD", "POST", "PUT", "DELETE"], // Allowed HTTP methods

  headers: true, // Allow all request headers

  exposeHeaders: [
    "cache-control",
    "content-language",
    "content-type",
    "expires",
    "last-modified",
    "pragma",
  ], // Headers to expose

  credentials: true, // Allow credentials (cookies, etc.)

  maxAge: 90, // Max age for caching preflight response
};

export default corsConfig;
