/** @jest-environment jsdom*/
import React from 'react';
import { render} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import {describe, test, it, expect} from "vitest";
import "./NavigationBar.css";



describe('NavigationBar', () => {
    // Test to verify if the Navigation Bar renders with the content inside of it
    it('Renders the Navigation Bar', () => {
        // Wrap the NavigationBar component in Router
        const { container } = render(
            <Router>
                <NavigationBar />
            </Router>
        );
        expect(container.firstChild).toBeTruthy();

    });
    
    //Test to verify weather the navigation bar remains at the top.
    it('Navigation Bar remains at the top', () => {
        const { container } = render(
            <Router>
                <NavigationBar />
            </Router>
        );

        // Find the navbar element
        const navbar = container.querySelector('.navbar');

        // Check if the navbar element exists
        expect(navbar).toBeTruthy(); 

    });


});
