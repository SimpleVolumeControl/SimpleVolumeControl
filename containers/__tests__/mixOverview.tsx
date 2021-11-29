import { render } from '@testing-library/preact';
import MixOverview from '../mixOverview';
import { RecoilRoot } from 'recoil';

describe('MixOverview', () => {
  test('should render correctly', () => {
    const { asFragment } = render(
      <RecoilRoot>
        <MixOverview />
      </RecoilRoot>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
