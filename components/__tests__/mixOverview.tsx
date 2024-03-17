import { render } from '@testing-library/react';
import MixOverview from '../mixOverview';
import { RecoilRoot } from 'recoil';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

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
