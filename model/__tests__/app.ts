import App from '../app';

describe('App', () => {
  test('should return the same instance every time', () => {
    const instance1 = App.getInstance();
    const instance2 = App.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('should return a list of mixes', () => {
    App.getInstance()
      .getMixes()
      .forEach((mix) => {
        expect(typeof mix.id).toBe('string');
        expect(mix.id.length).toBeGreaterThan(0);
        expect(typeof mix.name).toBe('string');
        expect(mix.name.length).toBeGreaterThan(0);
      });
  });

  test('should return an empty inputs list for invalid bus name', () => {
    expect(
      App.getInstance().getInputs('supercalifragilisticexpialidocious'),
    ).toEqual([]);
  });
});
