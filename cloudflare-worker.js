export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    const url = new URL(request.url);

    // Route: /api/contact
    if (url.pathname === '/api/contact') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
      }

      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      try {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        // Validate required fields
        const requiredFields = ['name', 'email', 'message'];
        const missingFields = requiredFields.filter(field => !data[field] || !data[field].trim());

        if (missingFields.length > 0) {
          return new Response(JSON.stringify({
            success: false,
            error: `Missing required fields: ${missingFields.join(', ')}`,
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid email address' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

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

        const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: 'info@finca.pr', name: 'Finca Del Mar' }],
              reply_to: { email: data.email, name: data.name },
            }],
            from: { email: 'noreply@finca.pr', name: 'Finca Del Mar Website' },
            subject: `Event Inquiry from ${data.name}`,
            content: [{ type: 'text/plain', value: emailContent }],
          }),
        });

        if (!emailResponse.ok) {
          console.error('Email sending failed:', await emailResponse.text());
          throw new Error('Failed to send email');
        }

        return new Response(JSON.stringify({
          success: true,
          message: "Thank you for your inquiry! We'll get back to you within 24 hours.",
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

      } catch (error) {
        console.error('Contact form error:', error);
        return new Response(JSON.stringify({
          success: false,
          error: 'Sorry, there was an error sending your message. Please try again or contact us directly.',
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    // All other requests: serve static assets
    return env.ASSETS.fetch(request);
  },
};
