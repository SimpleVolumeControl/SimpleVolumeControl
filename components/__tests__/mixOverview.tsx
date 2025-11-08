import { render } from '@testing-library/react';
import MixOverview from '../mixOverview';

vitest.mock('next/navigation', () => ({
  useRouter: vitest.fn(),
}));

describe('MixOverview', () => {
  test('should render correctly', () => {
    const { asFragment } = render(<MixOverview />);
    expect(asFragment()).toMatchSnapshot();
  });
});
