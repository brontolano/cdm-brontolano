import { describe, it, expect } from 'vitest';
import { waLink } from './waLink';

describe('waLink (normalisasi nomor WA)', () => {
  it('08xx -> 62xx', () => {
    expect(waLink('08123456789', 'hai')).toContain('wa.me/628123456789');
  });
  it('+62 -> 62', () => {
    expect(waLink('+628123456789', 'hai')).toContain('wa.me/628123456789');
  });
  it('membuang spasi/strip dan encode pesan', () => {
    const l = waLink('0812-345-6789', 'Halo Dunia');
    expect(l).toContain('wa.me/62812345');
    expect(l).toContain('Halo%20Dunia');
  });
});
