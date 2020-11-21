import React from 'react';
import Navbar from './Navbar';
import { render, screen, getByLabelText } from '@testing-library/react';
import { fireEvent } from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import App from '../../App';

// test('loads search page upon click', async () => {
//   const history = createMemoryHistory();

//   render(
//     <Router history={history}>
//       <App />
//     </Router>
//   );
//   // Click button
//   fireEvent.click(screen.getByText('Search'));
//   // Wait for page to update with query text
//   const items = await screen.findAllByText('Author');
//   expect(items).toHaveLength(1);
// });
