# duan (Raycast Extension)

URL shortener powered by Cloudflare Workers and D1 Database

## Project Structure

```
src/
├── components/
│   ├── LinkDetail.tsx     # Link detail view component
│   └── LinkItem.tsx       # Link list item component
├── services/
│   ├── api/
│   │   ├── endpoints/
│   │   │   └── links.ts   # Link-related API endpoints
│   │   ├── client.ts      # HTTP client implementation
│   │   ├── config.ts      # API configuration
│   │   ├── types.ts       # API type definitions
│   │   └── index.ts       # API exports
│   └── validation/
│       ├── slug/
│       │   ├── cache.ts   # Slug cache implementation
│       │   ├── index.ts   # Slug validation logic
│       │   └── types.ts   # Slug validation types
│       └── url/
│           ├── index.ts   # URL validation logic
│           └── types.ts   # URL validation types
└── shorten-link.tsx      # Command implementation
```

## Caching Mechanisms

Raycast provides three different caching mechanisms, each suited for specific use cases:

### Cache (Low-level API)
- **Characteristics:**
  - Basic key-value storage
  - Synchronous operations
  - Full cache management control
  - Usable outside React environment
- **Best for:**
  - Cache usage in non-React code
  - Precise control over cache read/write operations
  - Custom cache strategy implementation
  - Form validation caching

### useCachedState (React Hook)
- **Characteristics:**
  - Similar to useState but persisted
  - Suitable for UI state storage
  - Shareable between components
- **Best for:**
  - Persisting UI state across app restarts
  - Sharing persistent state between components
  - Storing user preferences
  - UI configuration persistence

### useCachedPromise (React Hook)
- **Characteristics:**
  - Implements stale-while-revalidate strategy
  - Automatic loading state handling
  - Built-in error handling
  - Optimized for async data fetching
- **Best for:**
  - Caching API call results
  - Background data refresh implementation
  - Optimizing data loading experience
  - List data caching

### Implementation Examples

To demonstrate how to choose the appropriate caching mechanism, here are two concrete examples from our project:

#### Links List Caching
- **Use Case:** Caching the list of all shortened links
- **Chosen Solution:** `useCachedPromise`
- **Rationale:**
  - Involves async API calls to fetch data
  - Requires automatic background refresh
  - Needs loading state management
  - Benefits from stale-while-revalidate strategy
  - Data should stay fresh while allowing immediate display of cached content

#### Slug Availability Validation
- **Use Case:** Caching results of slug availability checks
- **Chosen Solution:** `Cache` (low-level API)
- **Implementation Details:**
  1. When the "Shorten Link" command loads:
     - Fetch all used slugs via API
     - Store them in Cache synchronously
     - Use requestIdleCallback to avoid blocking UI
     - Include timeout and cleanup mechanisms
  2. During form validation:
     - Synchronously read from Cache
     - Perform format validation
     - Check against cached slugs
  3. Benefits:
     - Instant validation feedback
     - No async operations during form validation
     - Efficient resource usage
     - Non-blocking command startup
