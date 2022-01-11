import { render } from '@testing-library/preact';
import Header from '../header';
import { RecoilRoot } from 'recoil';
import { passwordState } from '../../containers/sessionProvider';

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
  test('should hide logout button when no password is set', () => {
    const { asFragment } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(passwordState, null);
        }}
      >
        <Header isHome={false} />
      </RecoilRoot>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
  test('should show logout button when password is set', () => {
    const { asFragment } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(passwordState, 'foobar');
        }}
      >
        <Header isHome={false} />
      </RecoilRoot>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
