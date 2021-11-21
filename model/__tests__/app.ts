import App from '../app';
import BehringerX32 from '../behringerX32';

describe('App', () => {
  test('should return the same instance every time', () => {
    const instance1 = App.getInstance();
    const instance2 = App.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('should return a BehringerX32 Mixer by default', () => {
    expect(App.getInstance().getMixer()).toBeInstanceOf(BehringerX32);
  });
});
