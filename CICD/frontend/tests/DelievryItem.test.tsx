import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeliveryItem, { DeliveryItemData, DeliveryItemProps } from '../components/DeliveryItem';
import '@testing-library/jest-dom';
import { Place, Storefront } from '@mui/icons-material';

// Mock data
const mockData: DeliveryItemData = {
  restaurant: 'Mock Restaurant',
  id: '1',
  location: '123 Mock Street',
  pay: 20,
  dropOff: { lng: 123.456, lat: 78.901 },
  dropOffName: 'Mock Dropoff',
  itemCount: 3,
  distanceText: '2 miles',
  timeText: '15 mins'
};

// Mock handleOnClick function
const mockHandleOnClick = jest.fn();

const props: DeliveryItemProps = {
  handleOnClick: mockHandleOnClick
};

test('renders DeliveryItem with required data', () => {
  render(<DeliveryItem {...mockData} {...props} />);

  // Check restaurant name
  expect(screen.getByText('Mock Restaurant')).toBeInTheDocument();

  // Check location
  expect(screen.getByText(/123 Mock Street/)).toBeInTheDocument();

  // Check item count
  expect(screen.getByText(/3 items/)).toBeInTheDocument();

  // Check pay
  expect(screen.getByText('$20.00')).toBeInTheDocument(); // assuming currencyFormatter formats pay as $20.00

  // Check dropOffName
  expect(screen.getByText('Mock Dropoff')).toBeInTheDocument();

  // Check distance and time
  expect(screen.getByText('2 miles (15 mins)')).toBeInTheDocument();

  // Check "View" button is rendered and clickable
  const viewButton = screen.getByText('View');
  expect(viewButton).toBeInTheDocument();

  // Click the "View" button
  fireEvent.click(viewButton);
  expect(mockHandleOnClick).toHaveBeenCalled();
});
