/* eslint-disable prettier/prettier */
import { fireEvent, render } from '@testing-library/react';
import RightSidebar from './RightSidebar';
import React from 'react';


test('Right renders correctly', () => {
    const { getByText } = render(<RightSidebar />);
    getByText('show details');
    });

