import { render } from '@testing-library/preact';
import MixOverview from '../mixOverview';

describe('MixOverview', () => {
  test('should render correctly', () => {
    const { asFragment } = render(<MixOverview />);
    expect(asFragment()).toMatchSnapshot();
  });
});
