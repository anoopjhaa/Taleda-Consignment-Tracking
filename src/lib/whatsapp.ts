/**
 * Sends a WhatsApp message via Interakt.shop (Standard Indian Provider).
 * This is the easiest way to manage an Indian WhatsApp Phone Number.
 */
export async function sendWhatsAppStatusUpdate(
  phone: string, 
  customerName: string, 
  status: string, 
  trackingNumber: string,
  senderCity: string,
  receiverCity: string
) {
  if (!phone) return;

  // Clean phone number: remove non-digits
  let cleanPhone = phone.replace(/\D/g, '');
  
  // Ensure country code (default to 91 for India)
  if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

  console.log(`[WhatsApp Service] Triggering Interakt for ${cleanPhone}...`);

  try {
    const apiKey = process.env.INTERAKT_API_KEY;
    const providerUrl = 'https://api.interakt.ai/v1/public/message/';

    if (!apiKey) {
      console.warn('[WhatsApp Service] Missing INTERAKT_API_KEY in .env.local. Message skipped.');
      return { success: false, error: 'Provider not configured' };
    }

    const payload = {
      fullPhoneNumber: cleanPhone,
      type: 'Template',
      template: {
        name: 'consignment_status_update', // Make sure this matches your Interakt panel
        languageCode: 'en',
        bodyValues: [
          customerName,
          status,
          trackingNumber,
          `${senderCity} to ${receiverCity}`
        ]
      }
    };

    const response = await fetch(providerUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Interakt Request Failed');
    }

    console.log('[WhatsApp Service] Interakt success:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('[WhatsApp Service] Failed to send message:', error.message);
    return { success: false, error: error.message };
  }
}
