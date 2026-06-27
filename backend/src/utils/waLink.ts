/**
 * Build a free WhatsApp click-to-chat link (no Twilio / paid API needed).
 * Normalises Indonesian numbers (08xx / +62xx) to the wa.me 62xx format.
 */
export function waLink(kontakWa: string, pesan: string): string {
  let num = kontakWa.replace(/[^0-9+]/g, '');
  if (num.startsWith('+')) num = num.slice(1);
  if (num.startsWith('0')) num = '62' + num.slice(1);
  if (!num.startsWith('62')) num = '62' + num;
  return `https://wa.me/${num}?text=${encodeURIComponent(pesan)}`;
}
