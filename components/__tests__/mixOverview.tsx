import { render } from '@testing-library/react';
import MixOverview from '../mixOverview';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('MixOverview', () => {
  test('should render correctly', () => {
    const { asFragment } = render(<MixOverview />);
    expect(asFragment()).toMatchSnapshot();
  });
});
