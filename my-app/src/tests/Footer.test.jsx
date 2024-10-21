/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Footer from '../components/Footer';

describe('Footer', () => {

  // Test case to verify if the footer renders with content inside
  it('renders the footer', () => {
    const { container } = render(<Footer />); 
    expect(container.firstChild).toBeTruthy();
  });

  // Test case to check if clicking the links in the footer redirects correctly
  it('redirects to the correct page when links are clicked', async () => {
    // Render the Footer component within a MemoryRouter to simulare routing
    render (
      <MemoryRouter initialEntries={["/footer"]}>
        <Routes>
          <Route path='/' element={<div>Home</div>} />
          <Route path='/resources' element={<div>Resources</div>} />
          <Route path='/about' element={<div>About Us</div>} />
          <Route path='/footer' element={<Footer />} />
        </Routes>
      </MemoryRouter>
    )


    // Check that the HOME link points to the correct path
    const homeLink = screen.getAllByText('HOME')[0];
    expect(homeLink.href).toContain('/');

    // Simulate clicking the HOME link and check if the content appars
    await userEvent.click(homeLink);
    expect(screen.getAllByText(/Home/i)).toBeTruthy();


    // Check that the RESOURCES link points to the correct path
    const resourcesLink = screen.getAllByText('RESOURCES')[0];
    expect(resourcesLink.href).toContain('/resources');

    // Simulate clicking the RESOURCES link and check if the content appars
    await userEvent.click(resourcesLink);
    expect(screen.getAllByText(/Resources/i)).toBeTruthy();


    // Check that the ABOUT US link points to the correct path
    const aboutUsLink = screen.getAllByText('ABOUT US')[0];
    expect(aboutUsLink.href).toContain('/about');

    // Simulate clicking the ABOUT US link and check if the content appars
    await userEvent.click(aboutUsLink);
    expect(screen.getAllByText(/About Us/i)).toBeTruthy();
  });
});




