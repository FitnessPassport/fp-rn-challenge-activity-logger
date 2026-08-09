import { render } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders the log activity action', async () => {
    const { findByText } = await render(<App />);
    expect(await findByText('Log an activity')).toBeTruthy();
  });
});
