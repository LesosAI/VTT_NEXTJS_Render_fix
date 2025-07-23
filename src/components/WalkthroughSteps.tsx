"use client";
import { useEffect, useRef } from 'react';
import { useWalkthrough } from './WalkthroughProvider';
import * as Driver from 'driver.js';
import 'driver.js/dist/driver.css';

interface WalkthroughStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'type' | 'select' | 'none';
  actionText?: string;
}

interface WalkthroughStepsProps {
  steps: WalkthroughStep[];
}

export const WalkthroughSteps: React.FC<WalkthroughStepsProps> = ({ steps }) => {
  const { 
    isWalkthroughActive, 
    currentStep, 
    nextStep, 
    previousStep, 
    stopWalkthrough,
    markWalkthroughComplete 
  } = useWalkthrough();
  
  const driverRef = useRef<any>(null);
  const currentStepIndex = useRef(0);

  // Function to filter steps based on visible elements
  const getVisibleSteps = (allSteps: WalkthroughStep[]) => {
    if (typeof window === 'undefined') return allSteps;
    
    return allSteps.filter(step => {
      const element = document.querySelector(step.target);
      return element !== null;
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !isWalkthroughActive) return;

    // Filter steps to only include visible elements
    const visibleSteps = getVisibleSteps(steps);
    console.log('Starting walkthrough with visible steps:', visibleSteps.length, 'out of', steps.length);
    
    if (visibleSteps.length === 0) {
      console.log('No visible steps found, ending walkthrough');
      markWalkthroughComplete();
      return;
    }

    currentStepIndex.current = 0;

    // Convert our steps to driver.js format
    const driverSteps = visibleSteps.map((step, index) => {
      console.log(`Creating step ${index}:`, step.target);
      return {
        element: step.target,
        popover: {
          title: step.title,
          description: step.content,
          side: step.position || 'bottom',
          align: 'center' as const,
          popoverClass: 'driverjs-theme',
          onNextClick: () => {
            console.log('Next button clicked for step:', index);
            currentStepIndex.current++;
            
            // Check if this is the last step
            if (index >= visibleSteps.length - 1) {
              console.log('Completing walkthrough');
              markWalkthroughComplete();
              driverRef.current.destroy();
            } else {
              // Move to next step using driver.js
              driverRef.current.moveNext();
            }
          },
          onPrevClick: () => {
            console.log('Previous button clicked for step:', index);
            if (currentStepIndex.current > 0) {
              currentStepIndex.current--;
            }
            // Move to previous step using driver.js
            driverRef.current.movePrevious();
          }
        },
      };
    });

    console.log('Driver steps created:', driverSteps.length);

    driverRef.current = Driver.driver({
      showProgress: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.7)',
      doneBtnText: 'Finish',
      nextBtnText: 'Next',
      prevBtnText: 'Previous',
      stagePadding: 10,
      showButtons: ['next', 'previous', 'close'],
      steps: driverSteps,
      onCloseClick: () => {
        console.log('Close button clicked');
        stopWalkthrough();
        if (driverRef.current) {
          driverRef.current.destroy();
        }
      },
      onDestroyStarted: () => {
        console.log('Driver destroy started');
      },
      onDestroyed: () => {
        console.log('Driver destroyed');
      },
      onHighlightStarted: (element) => {
        console.log('Highlight started for element:', element);
      },
      onHighlighted: (element) => {
        console.log('Element highlighted:', element);
      },
      onDeselected: (element) => {
        console.log('Element deselected:', element);
      },
    });

    // Start the tour
    setTimeout(() => {
      if (driverRef.current) {
        console.log('Starting driver drive()');
        driverRef.current.drive();
      }
    }, 100);

  }, [isWalkthroughActive, steps, stopWalkthrough, markWalkthroughComplete]);

  useEffect(() => {
    if (!isWalkthroughActive && driverRef.current) {
      driverRef.current.destroy();
    }
  }, [isWalkthroughActive]);

  return null; // This component doesn't render anything visible
};

// Campaign Generation Walkthrough Steps
export const campaignWalkthroughSteps: WalkthroughStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Campaign Generation!',
    content: 'Let\'s walk through how to create amazing campaign content. This tool helps you generate world-building, characters, and story elements for your tabletop RPG campaigns.',
    target: '.campaign-walkthrough-welcome',
    position: 'bottom',
    action: 'none'
  },
  {
    id: 'campaign-selection',
    title: 'Select a Campaign',
    content: 'First, select an existing campaign from the list on the left, or create a new one using the + button. You need to have a campaign selected to access the content generation features.',
    target: '.campaigns-list',
    position: 'right',
    action: 'click'
  },
  {
    id: 'campaign-context',
    title: 'Campaign Context Dropdowns',
    content: 'These dropdowns let you reference previous content from your campaign. Select existing world-building, character, or story content to provide context for new generations. This helps maintain consistency across your campaign.',
    target: '.campaign-context-dropdowns',
    position: 'bottom',
    action: 'none'
  },
  {
    id: 'content-category',
    title: 'Choose Content Category',
    content: 'Select what type of content you want to generate: World Building (locations, lore, history), Character (NPCs, player characters), or Story/Session (plot points, encounters, sessions).',
    target: 'select[value="World Building"]',
    position: 'bottom',
    action: 'select'
  },
  {
    id: 'description-input',
    title: 'Content Description',
    content: 'Describe what you want to generate. Be specific about details, tone, and requirements. You can also use the preset prompts above for quick ideas.',
    target: 'textarea[placeholder*="Describe what content"]',
    position: 'bottom',
    action: 'type'
  },
  {
    id: 'generate-button',
    title: 'Generate Content',
    content: 'Click this button to generate your content. The AI will use your campaign settings, context, and description to create unique content for your campaign.',
    target: 'button[type="submit"]',
    position: 'top',
    action: 'click'
  },
  {
    id: 'content-tabs',
    title: 'Content Organization',
    content: 'Your generated content is organized into tabs by category. Switch between World Building, Character, and Story/Session to view and manage your content.',
    target: '.content-tabs',
    position: 'bottom',
    action: 'none'
  },
  {
    id: 'completion',
    title: 'You\'re All Set!',
    content: 'You now know how to use the key features of campaign generation. Start creating amazing content for your tabletop RPG campaigns! You can restart this walkthrough anytime using the "Walkthrough" button.',
    target: '.campaign-walkthrough-complete',
    position: 'bottom',
    action: 'none'
  }
];

// Character Creation Walkthrough Steps
export const characterWalkthroughSteps: WalkthroughStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Character Creation!',
    content: 'Let\'s walk through how to create amazing character images. This tool helps you generate unique character portraits for your tabletop RPG campaigns.',
    target: '.character-walkthrough-welcome',
    position: 'bottom',
    action: 'none'
  },
  {
    id: 'style-selection',
    title: 'Choose Character Style',
    content: 'Select between Fantasy and Sci-Fi styles. This will influence the overall look and feel of your generated character.',
    target: '.character-style-buttons',
    position: 'bottom',
    action: 'click'
  },
  {
    id: 'image-resolution',
    title: 'Image Resolution',
    content: 'Adjust the image resolution using this slider. Higher resolutions (1024×1024) provide more detail but take longer to generate.',
    target: 'input[type="range"]',
    position: 'bottom',
    action: 'none'
  },
  {
    id: 'character-description',
    title: 'Character Description',
    content: 'Describe your character in detail. Include physical features, clothing, expressions, and any unique characteristics. The more specific you are, the better the result.',
    target: 'textarea[placeholder*="Describe your character"]',
    position: 'bottom',
    action: 'type'
  },
  {
    id: 'generate-button',
    title: 'Generate Character',
    content: 'Click this button to generate your character image. The AI will use your description and style settings to create a unique character portrait.',
    target: 'button[type="submit"]',
    position: 'top',
    action: 'click'
  },
  {
    id: 'character-history',
    title: 'Character History',
    content: 'View your previously generated characters here. Click on any character to see more details or regenerate variations.',
    target: '.character-history',
    position: 'top',
    action: 'none'
  },
  {
    id: 'completion',
    title: 'You\'re All Set!',
    content: 'You now know how to use the character creation tool. Start creating amazing character portraits for your tabletop RPG campaigns! You can restart this walkthrough anytime using the "Walkthrough" button.',
    target: '.character-walkthrough-complete',
    position: 'bottom',
    action: 'none'
  }
];

// Simple test version for debugging
export const testWalkthroughSteps: WalkthroughStep[] = [
  {
    id: 'test-1',
    title: 'Test Step 1',
    content: 'This is a test step to see if the walkthrough works.',
    target: '.campaign-walkthrough-welcome',
    position: 'bottom',
    action: 'none'
  },
  {
    id: 'test-2',
    title: 'Test Step 2',
    content: 'This is another test step.',
    target: '.campaign-context-dropdowns',
    position: 'bottom',
    action: 'none'
  },
  {
    id: 'test-3',
    title: 'Test Step 3',
    content: 'Final test step.',
    target: 'button[type="submit"]',
    position: 'top',
    action: 'none'
  }
]; 

// Map Creation Walkthrough Steps
export const mapWalkthroughSteps: WalkthroughStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Map Creation!',
    content: 'Let\'s walk through how to create amazing maps for your tabletop RPG campaigns. This tool helps you generate unique maps for your adventures.',
    target: '.map-walkthrough-welcome',
    position: 'bottom',
    action: 'none'
  },
  {
    id: 'style-selection',
    title: 'Choose Map Style',
    content: 'Select between Fantasy and Sci-Fi styles. This will influence the overall look and feel of your generated map.',
    target: '.map-style-buttons',
    position: 'bottom',
    action: 'click'
  },
  {
    id: 'image-shape',
    title: 'Map Shape',
    content: 'Adjust the map shape using this slider. You can create square maps or rectangular maps depending on your needs.',
    target: 'input[type="range"]',
    position: 'bottom',
    action: 'none'
  },
  {
    id: 'map-description',
    title: 'Map Description',
    content: 'Describe your map in detail. Include terrain features, landmarks, settlements, and any unique characteristics. The more specific you are, the better the result.',
    target: 'textarea[placeholder*="Describe your map"]',
    position: 'bottom',
    action: 'type'
  },
  {
    id: 'generate-button',
    title: 'Generate Map',
    content: 'Click this button to generate your map. The AI will use your description and style settings to create a unique map for your campaign.',
    target: 'button[type="submit"]',
    position: 'top',
    action: 'click'
  },
  {
    id: 'map-history',
    title: 'Map History',
    content: 'View your previously generated maps here. Click the "Download Map" button to save any map to your device.',
    target: '.map-history',
    position: 'top',
    action: 'none'
  },
  {
    id: 'completion',
    title: 'You\'re All Set!',
    content: 'You now know how to use the map creation tool. Start creating amazing maps for your tabletop RPG campaigns! You can restart this walkthrough anytime using the "Walkthrough" button.',
    target: '.map-walkthrough-complete',
    position: 'bottom',
    action: 'none'
  }
]; 