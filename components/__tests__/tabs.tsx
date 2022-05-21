import { render } from '@testing-library/preact';
import Tabs from '../tabs';

describe('Tabs', () => {
  test(`should render correctly`, () => {
    const { asFragment } = render(
      <Tabs
        tabs={[
          { id: 0, title: 'a', content: 'A' },
          { id: 1, title: 'b', content: 'B' },
          { id: 2, title: 'c', content: 'C' },
        ]}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
