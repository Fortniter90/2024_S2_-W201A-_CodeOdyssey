import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Profile from '../pages/profile';
import { useAuth } from '../context/AuthContext';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom'; 
import '@testing-library/jest-dom';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../components/ProfilePicture', () => ({
  default: () => <div>ProfilePicture</div>
}));

vi.mock('../components/ProgressBox', () => ({
  default: () => <div>ProgressBox</div>
}));

vi.mock('../components/Button', () => ({
  default: ({ text, action }) => (
    <button onClick={action}>{text}</button>
  )
}));

vi.mock('../components/NavigationBar', () => ({
  default: () => <div>NavigationBar</div>
}));

vi.mock('../components/SignOut', () => ({
  default: () => <div>SignOut</div>
}));

vi.mock('../components/Footer', () => ({
  default: () => <div>Footer</div>
}));

vi.mock('../components/Feedback', () => ({
  default: () => <div>Feedback</div>
}));

describe('Profile Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({
      currentUser: { name: 'John Doe' },
    });
  });

  it('renders loading state when user is null', () => {
    useAuth.mockReturnValueOnce({ currentUser: null });
    render(<Router><Profile /></Router>);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders user name when currentUser is present', () => {
    render(<Router><Profile /></Router>);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('USER SETTINGS')).toBeInTheDocument();
    expect(screen.getByText('PAST TESTS')).toBeInTheDocument();
  });

  it('navigates to settings when USER SETTINGS button is clicked', () => {
    render(<Router><Profile /></Router>);

    fireEvent.click(screen.getByText('USER SETTINGS'));
    expect(mockNavigate).toHaveBeenCalledWith('settings');
  });

  it('navigates to past tests when PAST TESTS button is clicked', () => {
    render(<Router><Profile /></Router>);

    fireEvent.click(screen.getByText('PAST TESTS'));
    expect(mockNavigate).toHaveBeenCalledWith('pasttests');
  });
});
