import { fireEvent, render, getByText } from '@testing-library/react';
import RightSidebar from './RightSidebar';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
test('Right renders correctly', () => {
  const { getByText } = render(<RightSidebar />);
  getByText('show details');
});
