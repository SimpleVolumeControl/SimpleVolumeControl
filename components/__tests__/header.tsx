import { render } from '@testing-library/react';
import Header from '../header';
import * as nextNavigationModule from 'next/navigation';
import * as useLoginModule from '../../hooks/useLogin';

vitest.mock('next/navigation', () => ({
  useRouter: vitest.fn(),
  usePathname: vitest.fn().mockReturnValue('/config'),
}));

describe('Header', () => {
  beforeEach(() => {
    vitest.spyOn(useLoginModule, 'default').mockReturnValue({
      login: vitest.fn(),
      logout: vitest.fn(),
      isLoggedIn: false,
      password: '',
    });
  });

  test('should render correctly on home page', () => {
    vitest.spyOn(nextNavigationModule, 'usePathname').mockReturnValue('/');
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
  test('should render correctly on other pages', () => {
    vitest
      .spyOn(nextNavigationModule, 'usePathname')
      .mockReturnValue('/config');
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
  test('should hide logout button when no password is set', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
  test('should show logout button when password is set', () => {
    vitest.spyOn(useLoginModule, 'default').mockReturnValue({
      login: vitest.fn(),
      logout: vitest.fn(),
      isLoggedIn: true,
      password: '',
    });
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
});
