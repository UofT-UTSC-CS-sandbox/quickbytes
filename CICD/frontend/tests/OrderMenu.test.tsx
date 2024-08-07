import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderMenu from '../components/OrderMenu';
import '@testing-library/jest-dom';

// Mock functions
const mockSetOrderId = jest.fn();
const mockSetLoading = jest.fn();

// Mock data
const mockOrderIds = ['1', '2', '3'];

test('renders OrderMenu and handles menu interaction', async () => {
  render(
    <OrderMenu 
      orderIds={mockOrderIds} 
      setOrderId={mockSetOrderId} 
      setLoading={mockSetLoading} 
    />
  );

  // Check if button is rendered
  const button = screen.getByRole('button', { name: /Select Order/i });
  expect(button).toBeInTheDocument();

  // Click the button to open the menu
  fireEvent.click(button);

  // Wait for menu to open
  await waitFor(() => {
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  // Check if menu items are rendered
  mockOrderIds.forEach(orderId => {
    expect(screen.getByText(`Order ${orderId}`)).toBeInTheDocument();
  });

  // Click on the first menu item
  fireEvent.click(screen.getByText('Order 1'));

  // Check if setOrderId was called with the correct argument
  expect(mockSetOrderId).toHaveBeenCalledWith('1');

  // Check if menu is closed after clicking
  await waitFor(() => {
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

test('handles loading state and error state', async () => {
  // Test loading state
  mockSetLoading.mockImplementation(() => {});
  
  // Render with a delayed loading simulation
  const { rerender } = render(
    <OrderMenu 
      orderIds={[]} 
      setOrderId={mockSetOrderId} 
      setLoading={mockSetLoading} 
    />
  );

  expect(mockSetLoading).toHaveBeenCalledWith(true);

  // Simulate loading and then render with orders
  await waitFor(() => {
    rerender(
      <OrderMenu 
        orderIds={mockOrderIds} 
        setOrderId={mockSetOrderId} 
        setLoading={mockSetLoading} 
      />
    );
    
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  // Check for error handling
  const errorText = screen.queryByText(/Error loading orders:/i);
  expect(errorText).not.toBeInTheDocument();
});
