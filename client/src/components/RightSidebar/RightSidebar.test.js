import { fireEvent, render, getByText } from '@testing-library/react';
import RightSidebar from './RightSidebar';
import React from 'react';
test('Right renders correctly', () => {
  const { getByText } = render(<RightSidebar />);
  getByText('show details');
});
