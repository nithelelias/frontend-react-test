
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  const app=render(<App />);
  expect(app.getByText("All")).toBeInTheDocument();
  expect(app.getByText(/my favs/i)).toBeInTheDocument(); 
});
