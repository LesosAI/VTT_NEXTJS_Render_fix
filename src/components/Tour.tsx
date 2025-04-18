// components/Tour.tsx
'use client';

import { useEffect } from 'react';
import * as Driver from 'driver.js';
import 'driver.js/dist/driver.css';
import { useLogin } from '@/context/LoginContext';

const Tour = () => {

    const username = useLogin().username;

    useEffect(() => {
        if (typeof window === 'undefined') return; // Ensure it's client-side

        const tourKey = `hasSeenTour-${username}`;
        const hasSeenTour = localStorage.getItem(tourKey);
        if (hasSeenTour) return;

        const driver = Driver.driver({
            showProgress: true,
            allowClose: true,
            popoverClass: 'driverjs-theme',
            overlayColor: 'rgb(251, 248, 186)',
            doneBtnText: 'Finish',
            nextBtnText: 'Next',
            prevBtnText: 'Back',
            stagePadding: 10,
            showButtons: [
                'next',
                'previous',
                'close'
            ],
            steps: [
                {
                    element: '#generate-btn',
                    popover: {
                        title: 'Generate Button',
                        description: 'Click here to generate your assets.',
                        side: 'bottom',
                        align: 'center',
                        popoverClass: 'driverjs-theme',                        
                        onNextClick: () => {
                            document.getElementById('generate-btn')?.click();
                            driver.moveNext();
                        }
                    },
                },
                {
                    element: '#generation-options',
                    popover: {
                        title: 'Types of Generation',
                        description: 'Choose the type of generation you want to perform.',
                        side: 'left',
                        align: 'center',
                        popoverClass: 'driverjs-theme',
                        onNextClick: () => {
                            document.getElementById('topbar-menu-button')?.click();
                            driver.moveNext();
                        }
                    },
                },
                {
                    element: '#topbar-menu',
                    popover: {
                        title: 'Menu',
                        description: 'Access various features and settings from here.',
                        side: 'right',
                        align: 'center',
                        popoverClass: 'driverjs-theme',
                        onNextClick: () => {
                            document.getElementById('topbar-menu-button')?.click();
                            document.getElementById('generate-btn')?.click();
                            driver.moveNext();
                        }
                    },
                },
            ],
        });


        setTimeout(() => {
            driver.drive();
            localStorage.setItem(tourKey, 'true');
        }, 500); // Delay to ensure elements are rendered
    }, []);

    return null;
};

export default Tour;