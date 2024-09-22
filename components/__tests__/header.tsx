import { render } from '@testing-library/react';
import Header from '../header';
import * as nextNavigationModule from 'next/navigation';
import * as useLoginModule from '../../hooks/useLogin';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn().mockReturnValue('/config'),
}));

describe('Header', () => {
  beforeEach(() => {
    jest.spyOn(useLoginModule, 'default').mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      isLoggedIn: false,
      password: '',
    });
  });

  test('should render correctly on home page', () => {
    jest.spyOn(nextNavigationModule, 'usePathname').mockReturnValue('/');
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
  test('should render correctly on other pages', () => {
    jest.spyOn(nextNavigationModule, 'usePathname').mockReturnValue('/config');
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
  test('should hide logout button when no password is set', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
  test('should show logout button when password is set', () => {
    jest.spyOn(useLoginModule, 'default').mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      isLoggedIn: true,
      password: '',
    });
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
});
