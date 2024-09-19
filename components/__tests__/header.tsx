import { render } from '@testing-library/react';
import Header from '../header';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Header', () => {
  test('should render correctly on home page', () => {
    const { asFragment } = render(<Header isHome={true} />);
    expect(asFragment()).toMatchSnapshot();
  });
  test('should render correctly on other pages', () => {
    const { asFragment } = render(<Header isHome={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
  test('should hide logout button when no password is set', () => {
    const { asFragment } = render(<Header isHome={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
  test('should show logout button when password is set', () => {
    // TODO
  });
});
