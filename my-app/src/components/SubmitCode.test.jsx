import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import React from 'react';
import { it, vi, expect, describe, beforeEach } from 'vitest';
import CompilerComponent from './SubmitCode';

// Mock socket instance
const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
};

vi.mock('./Button', () => ({
  __esModule: true,
  default: ({ text, action }) => <button onClick={action}>{text}</button>,
}));

describe('CompilerComponent', () => {

  beforeEach(() => {
    // Reset all mocks to ensure clean slate before each test
    vi.clearAllMocks();
  });

  it('handles code submission and displays correct output', async () => {
    const code = 'print("Hello, World!")';
    const answer = 'Hello, World!';
    const language = 'python';

    await act(async () => {
      render(<CompilerComponent
        code={code}
        answer={answer}
        language={language}
        socket={mockSocket}
      />);
    });

    const runButton = screen.getByText('RUN CODE');
    await act(async () => {
      fireEvent.click(runButton);
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('submitCode', {
      source_code: code,
      language: language,
    });

    await act(async () => {
      const codeResultHandler = mockSocket.on.mock.calls.find(call => call[0] === 'codeResult')[1];
      codeResultHandler({ output: 'Hello,rorld!', error: null });
    });

    const outputSection = screen.getByText('Output').closest('.code-results');
    expect(outputSection).toBeInTheDocument();

    const expectedOutputSection = screen.getByText('Expected Output').closest('.code-results');
    expect(expectedOutputSection).toBeInTheDocument();

    const outputElements = screen.getAllByText('Hello,rorld!', { selector: 'pre' });
    expect(outputElements.length).toBeGreaterThan(0);

    const outputWithinOutputSection = outputElements.some(element =>
      outputSection.contains(element)
    );
    expect(outputWithinOutputSection).toBe(true);
  });

  it('displays an error message when backend connection fails', async () => {
    const code = 'print("Hello, World!")';
    const answer = 'Hello, World!';
    const language = 'python';

    await act(async () => {
      render(<CompilerComponent
        code={code}
        answer={answer}
        language={language}
        socket={mockSocket}
      />);
    });

    const runButton = screen.getByText('RUN CODE');
    await act(async () => {
      fireEvent.click(runButton);
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('submitCode', {
      source_code: code,
      language: language,
    });

    // Simulate a connection failure
    await act(async () => {
      const connectErrorHandler = mockSocket.on.mock.calls.find(call => call[0] === 'connect_error')[1];
      connectErrorHandler(new Error('Unable to connect to the server'));
    });

    // Check for the error message
    const errorMessage = screen.getByTestId('connection-error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.textContent).toBe('Backend Connection Failure: Unable to connect to the server');
  });
});

