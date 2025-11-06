# Substack Integration Guide

## Overview
This guide explains how the Substack integration works and how to troubleshoot image loading issues.

## Integration Architecture

### 1. RSS Feed (Primary Source)
- **Endpoint**: `/api/substack`
- **Method**: Fetches from `https://[your-substack].substack.com/feed`
- **Content**: Articles with HTML content including images
- **Fallback**: Automatically used when API fails

### 2. Article Content Extraction
- **Endpoint**: `/api/substack/article`
- **Method**: Scrapes full article HTML from Substack URLs
- **Preservation**: Keeps all images with proper styling

## Image Handling

### Substack CDN URLs
Substack hosts images on:
- `https://substackcdn.com/image/fetch/...`
- `https://substack-post-media.s3.amazonaws.com/...`

### Configuration

#### Next.js Config (`next.config.mjs`)
```javascript
images: {
  unoptimized: true,
  remotePatterns: [
    { hostname: 'substackcdn.com' },
    { hostname: 'substack-post-media.s3.amazonaws.com' },
    { hostname: '**.substack.com' },
  ],
}
```

#### CSS (`app/globals.css`)
```css
.article-content img {
  display: block !important;
  max-width: 100% !important;
  width: 100% !important;
  height: auto !important;
  margin: 1.5rem auto !important;
  border-radius: 0.5rem !important;
  opacity: 1 !important;
  visibility: visible !important;
}
```

## Troubleshooting

### Images Not Loading

1. **Check Console Logs**
   - Open browser DevTools (F12)
   - Look for: "Found images: X"
   - Check for image URLs in logs

2. **Verify RSS Feed**
   ```bash
   curl -s "https://your-substack.substack.com/feed" | grep -i img
   ```

3. **Check Article Content**
   - View `/api/substack` response in DevTools Network tab
   - Verify `content` field contains HTML with `<img>` tags

4. **Common Issues**
   
   **Issue**: Empty articles array
   - **Cause**: No published articles on Substack
   - **Solution**: Publish at least one article
   
   **Issue**: Images have broken URLs
   - **Cause**: CSP or CORS blocking
   - **Solution**: Check browser console for CSP errors
   
   **Issue**: Images hidden by CSS
   - **Cause**: Conflicting styles
   - **Solution**: Use `!important` in CSS (already applied)

### Testing Locally

1. **Environment Variables** (`.env.local`)
   ```bash
   NEXT_PUBLIC_SUBSTACK_URL=https://your-publication.substack.com
   SUBSTACK_API_KEY=your_api_key_here  # Optional
   ```

2. **Restart Dev Server**
   ```bash
   npm run dev
   ```

3. **Test Endpoints**
   - Articles list: `http://localhost:3000/api/substack`
   - Single article: `http://localhost:3000/writings/article-slug`

4. **Check Browser Console**
   - Should see: "Found images: X"
   - Should see: "Processing image 1: [URL]"
   - Should see: "Image loaded successfully"

## Image Processing Flow

1. **RSS Feed Parse** (`app/api/substack/route.ts`)
   - Extracts HTML from `<description>` tags
   - Finds first image for featured image
   - Preserves all images in content
   - Adds inline styles to ensure visibility

2. **Article Extraction** (`app/api/substack/article/route.ts`)
   - Fetches full HTML from Substack URL
   - Extracts article content with images
   - Cleans unwanted elements (ads, navigation)
   - Preserves images with proper formatting

3. **Client Rendering** (`app/writings/[slug]/page.tsx`)
   - Displays featured image at top
   - Renders HTML content with dangerouslySetInnerHTML
   - Post-processes images via useEffect
   - Forces visibility with inline styles
   - Handles image load errors gracefully

4. **CSS Styling** (`app/globals.css`)
   - Global styles for `.article-content img`
   - Forces visibility with `!important`
   - Ensures responsive sizing
   - Adds spacing and border radius

## Best Practices

1. **Always use absolute URLs** for images
2. **Test with real Substack content** to verify extraction
3. **Check console logs** during development
4. **Use fallback content** if images fail to load
5. **Monitor CORS/CSP issues** in browser console

## API Key (Optional)

If using SubstackAPI.dev:
- Add `SUBSTACK_API_KEY` to `.env.local`
- System will try API first, fall back to RSS
- API provides better structured data
- Current implementation handles both sources

## Debugging Commands

```bash
# Check RSS feed
curl -s "https://your-substack.substack.com/feed" | head -200

# Test API endpoint locally
curl -s "http://localhost:3000/api/substack" | jq

# Check specific article
curl -s "http://localhost:3000/api/substack/article?url=ARTICLE_URL" | jq

# Check image extraction
curl -s "http://localhost:3000/api/substack" | jq '.articles[0].image'
curl -s "http://localhost:3000/api/substack" | jq '.articles[0].content' | grep img
```

## Support

If images still don't load:
1. Share console logs from browser
2. Check Network tab for failed requests
3. Verify Substack RSS feed has content
4. Ensure articles are published (not drafts)


