const { sendWhatsAppStatusUpdate } = require('../src/lib/whatsapp');
require('dotenv').config({ path: '.env.local' });

const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('Usage: node scripts/whatsapp-terminal.js <phone> <name> <status> [tracking_number]');
  process.exit(1);
}

const [phone, name, status, tracking = 'CN-TEST-001'] = args;

console.log(`🚀 [Terminal] Triggering WhatsApp for ${name} (${phone}) - Status: ${status}`);

sendWhatsAppStatusUpdate(
  phone,
  name,
  status,
  tracking,
  'Origin City',
  'Destination City'
).then(res => {
  if (res.success) {
    console.log('✅ Message triggered successfully!');
  } else {
    console.log('❌ Failed:', res.error);
    if (res.error === 'Provider not configured') {
        console.log('TIP: Please set INTERAKT_API_KEY in .env.local');
    }
  }
}).catch(err => {
  console.error('💥 Fatal Error:', err.message);
});
