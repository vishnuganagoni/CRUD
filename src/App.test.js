import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (options && options.method === 'POST') {
      return Promise.resolve({
        json: () => Promise.resolve({ id: 3, name: 'Test User' }),
      });
    }
    if (options && options.method === 'PUT') {
      return Promise.resolve({
        json: () => Promise.resolve({}),
      });
    }
    if (options && options.method === 'DELETE') {
      return Promise.resolve({
        json: () => Promise.resolve({}),
      });
    }

    // Default GET
    return Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ]),
    });
  });
});

afterEach(() => {
  global.fetch.mockClear();
});

test('renders main header', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText(/React \+ Node CRUD App/i)).toBeInTheDocument();
  });
});

test('adds a new user', async () => {
  render(<App />);

  const input = screen.getByPlaceholderText('Enter user name');
  const addButton = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(input, { target: { value: 'Test User' } });
  expect(input.value).toBe('Test User');

  fireEvent.click(addButton);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Test User' }),
      })
    );
  });
});

test('deletes a user', async () => {
  render(<App />);

  const deleteButtons = await screen.findAllByText('Delete');
  expect(deleteButtons.length).toBeGreaterThan(0);

  fireEvent.click(deleteButtons[0]);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/1'),
      expect.objectContaining({
        method: 'DELETE',
      })
    );
  });
});

test('updates user 1', async () => {
  render(<App />);

  const updateButton = screen.getByText(/Update User 1 to 'Updated User'/i);
  fireEvent.click(updateButton);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/1'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated User' }),
      })
    );
  });
});
