# duan (Raycast Extension)

URL shortener powered by Cloudflare Workers and D1 Database

## Project Structure

```
src/
├── services/
│   └── api/
│       ├── endpoints/
│       │   └── links.ts       # Link-related API endpoints
│       ├── client.ts          # HTTP client implementation
│       ├── config.ts          # API configuration
│       ├── types.ts           # API type definitions
│       └── index.ts           # API exports
├── types/
│   └── index.ts              # Global type definitions
└── shorten-link.tsx         # Main UI component
```