import { render } from '@testing-library/preact';
import Header from '../header';

describe('Header', () => {
  test('should render correctly on home page', () => {
    const { asFragment } = render(<Header isHome={true} />);
    expect(asFragment()).toMatchSnapshot();
  });
  test('should render correctly on other pages', () => {
    const { asFragment } = render(<Header isHome={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
