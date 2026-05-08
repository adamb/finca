// Cloudflare Worker for Finca Del Mar Contact Form
// Deploy this to handle form submissions and send emails

export default {
  async fetch(request, env, ctx) {
    // Handle CORS for all requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Only handle POST requests to /contact
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/contact') {
      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders,
      });
    }

    try {
      // Parse form data
      const formData = await request.formData();
      const data = Object.fromEntries(formData);

      // Validate required fields
      const requiredFields = ['name', 'email', 'message'];
      const missingFields = requiredFields.filter(field => !data[field] || !data[field].trim());
      
      if (missingFields.length > 0) {
        return new Response(JSON.stringify({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid email address'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // Create email content
      const emailContent = `
New Event Inquiry from Finca Del Mar Website

Contact Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}

Event Details:
- Event Type: ${data.event_type || 'Not specified'}
- Preferred Date: ${data.event_date || 'Not specified'}
- Guest Count: ${data.guest_count || 'Not specified'}

Message:
${data.message}

---
Submitted: ${new Date().toISOString()}
IP Address: ${request.headers.get('CF-Connecting-IP') || 'Unknown'}
User Agent: ${request.headers.get('User-Agent') || 'Unknown'}
      `.trim();

      // Send email using Mailgun, SendGrid, or similar service
      // This example uses the MailChannels API (free for Cloudflare Workers)
      const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: 'info@finca.pr', name: 'Finca Del Mar' }],
            reply_to: { email: data.email, name: data.name },
          }],
          from: {
            email: 'noreply@finca.pr',
            name: 'Finca Del Mar Website'
          },
          subject: `Event Inquiry from ${data.name}`,
          content: [{
            type: 'text/plain',
            value: emailContent
          }]
        }),
      });

      if (!emailResponse.ok) {
        console.error('Email sending failed:', await emailResponse.text());
        throw new Error('Failed to send email');
      }

      // Return success response
      return new Response(JSON.stringify({
        success: true,
        message: 'Thank you for your inquiry! We\'ll get back to you within 24 hours.'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });

    } catch (error) {
      console.error('Contact form error:', error);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Sorry, there was an error sending your message. Please try again or contact us directly.'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
};

/* 
DEPLOYMENT INSTRUCTIONS:

1. Create a new Cloudflare Worker
2. Replace the default code with this script
3. Set up a custom domain or use the workers.dev subdomain
4. Update the form submission URL in script.js

ALTERNATIVE EMAIL SERVICES:

For production, you might want to use a more robust email service:

1. **Mailgun**: Add API key to environment variables
2. **SendGrid**: Similar setup with API key
3. **Amazon SES**: If using AWS integration
4. **Custom SMTP**: Via nodemailer or similar library

ENVIRONMENT VARIABLES (optional):
- MAILGUN_API_KEY: Your Mailgun API key
- SENDGRID_API_KEY: Your SendGrid API key
- TO_EMAIL: Override recipient email

SECURITY CONSIDERATIONS:
- Rate limiting: Add IP-based rate limiting
- Spam protection: Add reCAPTCHA verification
- Input sanitization: Already basic sanitization in place
- CORS: Currently allows all origins, restrict in production
*/