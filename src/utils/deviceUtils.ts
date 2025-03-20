import { Dimensions } from 'react-native';

/**
 * Helper functions for device detection and adaptations
 */

// Initial dimensions
export const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

// Check if device is a tablet based on screen dimensions
export const isTablet = (width: number, height: number): boolean => 
  width > 768 || height > 768;

// Initial tablet check 
export const initialIsTablet = isTablet(initialWidth, initialHeight);

// Check if device is in landscape orientation
export const isLandscape = (width: number, height: number): boolean => 
  width > height; 