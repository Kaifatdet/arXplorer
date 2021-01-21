/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RightSidebar from './RightSidebar';
import React from 'react';

test('RightSidebar renders correctly', () => {
    const { getByText } = render(<RightSidebar />);
    getByText('show details');
});

test('Author shows', () => {
    const { getByTestId } = render(<RightSidebar />);
    getByTestId('author-testid');
});
