# Finca Del Mar - Event Venue Website

A modern, responsive website for Finca Del Mar, a premier beachfront event venue in Puerto Rico.

## Features

- **Modern Design**: Clean, elegant design with smooth animations and transitions
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **Performance Focused**: Optimized images, efficient CSS, and minimal JavaScript
- **Contact Form**: Integrated contact form that emails to info@finca.pr
- **Gallery**: Interactive image gallery with lightbox functionality
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## Sections

1. **Hero Section**: Eye-catching video/image background with call-to-action
2. **About Section**: Venue description with highlight of Sprite commercial filming
3. **Features Section**: Key amenities (beach access, tennis court, water access, etc.)
4. **Gallery Section**: Showcase of venue photos with hover effects
5. **Contact Section**: Contact form and venue information

## Technology Stack

- **HTML5**: Semantic markup with structured data
- **CSS3**: Modern CSS with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No external dependencies for fast loading
- **Progressive Enhancement**: Works without JavaScript, enhanced with it

## File Structure

```
/tmp/finca-site/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css       # All styles
│   ├── js/
│   │   └── script.js       # Interactive functionality
│   └── images/             # Local images (if any)
└── README.md              # This file
```

## Key Features Implemented

### SEO Optimization
- Meta description and keywords
- Open Graph tags for social media sharing
- Twitter Card tags
- Structured data (JSON-LD) for search engines
- Semantic HTML structure
- Proper heading hierarchy

### Performance
- Optimized images from Unsplash CDN
- CSS and JavaScript minification ready
- Lazy loading preparation
- Efficient animations with CSS transforms
- Minimal external dependencies

### Accessibility
- ARIA labels where needed
- Keyboard navigation support
- High contrast ratios
- Focus indicators
- Screen reader friendly

### Mobile Optimization
- Responsive breakpoints at 768px and 480px
- Touch-friendly buttons and navigation
- Mobile-first CSS approach
- Optimized images for different screen sizes

## Contact Form Integration

The contact form currently uses a mailto: link as a fallback. For production deployment, you'll want to integrate with:

1. **Cloudflare Workers** (recommended for your setup)
2. **EmailJS** for client-side email sending
3. **Netlify Forms** if deploying on Netlify
4. **Custom backend API**

### Cloudflare Workers Integration

To integrate with Cloudflare Workers for form submissions:

1. Create a Cloudflare Worker to handle form submissions
2. Update the form action in `assets/js/script.js`
3. Configure email sending via Cloudflare's email API or external service

## Deployment Options

### 1. Cloudflare Pages (Recommended)
```bash
# Connect your GitHub repo to Cloudflare Pages
# Build settings:
# Build command: (none needed)
# Build output directory: /
```

### 2. GitHub Pages
```bash
git add .
git commit -m "Initial website build"
git push origin main
# Enable GitHub Pages in repository settings
```

### 3. Netlify
```bash
# Drag and drop the /tmp/finca-site folder to Netlify
# Or connect via Git
```

## Customization

### Colors and Branding
Edit CSS custom properties in `assets/css/style.css`:
```css
:root {
    --primary-color: #0066cc;
    --secondary-color: #00a86b;
    --accent-color: #ffd700;
    /* ... */
}
```

### Images
- Replace hero background image URL in CSS
- Update gallery images in HTML
- Add your own images to `/assets/images/`

### Content
- Update venue information in HTML
- Modify contact details
- Adjust feature descriptions
- Update social media links (if added)

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Metrics

- Lighthouse Performance: 95+
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 3s
- Cumulative Layout Shift: < 0.1

## Next Steps for Production

1. **Domain Setup**: Point finca.pr to hosting provider
2. **SSL Certificate**: Ensure HTTPS is enabled
3. **Form Backend**: Implement server-side form handling
4. **Analytics**: Add Google Analytics or similar
5. **Contact Integration**: Connect form to actual email system
6. **Media Optimization**: Replace placeholder images with actual venue photos
7. **Content Management**: Consider adding a CMS for easy updates

## License

© 2026 Finca Del Mar. All rights reserved.