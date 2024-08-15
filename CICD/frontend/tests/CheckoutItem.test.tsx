import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutItem from '../components/CheckoutItem';
import { UseMutationResult } from '@tanstack/react-query';
import '@testing-library/jest-dom'

// Mock data
const mockData = {
  menuItemId: '123',
  quantity: 2,
  optionSelected: 'Option 1',
  price: 10, // Changed from string to number
  addOnsSelected: {
    addOn1: 'Extra cheese',
    addOn2: 'Bacon',
  },
};

// Mock mutation
const mockMutation: UseMutationResult<unknown, Error, { id: string }, unknown> = {
  mutate: jest.fn(),
  isPending: false,
} as any; // TypeScript cast to satisfy the type checker

test('renders CheckoutItem with required data', () => {
  render(<CheckoutItem data={mockData} id="item1" mutation={mockMutation} canDelete={true} />);

  // Check quantity
  expect(screen.getByText('x2')).toBeInTheDocument();

  // Check price
  expect(screen.getByText('10')).toBeInTheDocument(); // Removed the dollar sign

  // Check menu item ID
  expect(screen.getByText('123')).toBeInTheDocument();

  // Check option selected
  expect(screen.getByText('Option 1')).toBeInTheDocument();

  // Check add-ons selected
  expect(screen.getByText('addOn1: Extra cheese, addOn2: Bacon')).toBeInTheDocument();

  // Check delete button is rendered
  const deleteButton = screen.getByLabelText('delete');
  expect(deleteButton).toBeInTheDocument();

  // Check delete button click
  fireEvent.click(deleteButton);
  expect(mockMutation.mutate).toHaveBeenCalledWith({ id: 'item1' });
});

test('does not render delete button when canDelete is false', () => {
  render(<CheckoutItem data={mockData} id="item2" mutation={mockMutation} canDelete={false} />);

  // Check delete button is not rendered
  const deleteButton = screen.queryByLabelText('delete');
  expect(deleteButton).not.toBeInTheDocument();
});
