/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RightSidebar, { RightSidebarProps } from './RightSidebar';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';


test('Right renders correctly', () => {
    const handleQuickSearch = jest.fn();
    const { getByText } = render(<RightSidebar handleQuickSearch={handleQuickSearch} />);
    getByText('show details');
});

// describe("<RightSidebar />", () => {
//     test("should display a blank login form, with remember me checked by default", async () => {
//       // ???
//     });
//   });

//typescript ignore test files GOOGLE