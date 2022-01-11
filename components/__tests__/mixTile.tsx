import { render } from '@testing-library/preact';
import MixTile from '../mixTile';

describe('MixTile', () => {
  [
    'green',
    'lightblue',
    'blue',
    'pink',
    'red',
    'yellow',
    'white',
    'foobar',
  ].forEach((color) =>
    test(`should render correctly (${color})`, () => {
      const { asFragment } = render(
        <MixTile id="mix01" name="Mix 1" color={color} />,
      );
      expect(asFragment()).toMatchSnapshot();
    }),
  );
});
