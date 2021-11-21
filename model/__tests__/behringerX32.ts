import BehringerX32 from '../behringerX32';

describe('BehringerX32', () => {
  test('should return valid mixes', () => {
    const mixes = new BehringerX32().getMixes();
    mixes.forEach((mix) => {
      expect([
        'bus01',
        'bus02',
        'bus03',
        'bus04',
        'bus05',
        'bus06',
        'bus07',
        'bus08',
        'bus09',
        'bus10',
        'bus11',
        'bus12',
        'bus13',
        'bus14',
        'bus15',
        'bus16',
        'mc',
        'lr',
      ]).toContain(mix);
    });
  });
});
