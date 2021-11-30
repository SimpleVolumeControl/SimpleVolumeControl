import { render } from '@testing-library/preact';
import Header from '../header';
import { RecoilRoot } from 'recoil';

describe('Header', () => {
  test('should render correctly on home page', () => {
    const { asFragment } = render(
      <RecoilRoot>
        <Header isHome={true} />
      </RecoilRoot>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
  test('should render correctly on other pages', () => {
    const { asFragment } = render(
      <RecoilRoot>
        <Header isHome={false} />
      </RecoilRoot>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
