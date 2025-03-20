import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { styles } from './styles';
import { formatTime } from '../../utils/timeFormatter';
import ThumbnailPreview from './ThumbnailPreview';

interface SeekBarProps {
  currentTime: number;
  duration: number;
  seeking: boolean;
  thumbnailOpacity: any;
  sliderWidth: number;
  setSliderWidth: (width: number) => void;
  onSliderValueChange: (value: number) => void;
  onSliderSlidingComplete: (value: number) => void;
  getThumbnailPosition: (time: number) => number;
  dynamicStyles: any;
  onControlInteraction: () => void;
}

const SeekBar: React.FC<SeekBarProps> = ({
  currentTime,
  duration,
  seeking,
  thumbnailOpacity,
  sliderWidth,
  setSliderWidth,
  onSliderValueChange,
  onSliderSlidingComplete,
  getThumbnailPosition,
  dynamicStyles,
  onControlInteraction
}) => {
  // Add state for displayed time to avoid frequent updates
  const [displayTime, setDisplayTime] = useState(currentTime);
  const [isDragging, setIsDragging] = useState(false);
  const [displayedRemainingTime, setDisplayedRemainingTime] = useState(formatTime(Math.max(0, duration - currentTime)));
  // Track the last dragged value to prevent jumps
  const [lastDraggedValue, setLastDraggedValue] = useState<number | null>(null);
  
  // Only update display time when not dragging or seeking
  useEffect(() => {
    if (!isDragging && !seeking) {
      setDisplayTime(currentTime);
      setLastDraggedValue(null); // Reset last dragged value when stable
      // Update displayed remaining time only when not dragging
      setDisplayedRemainingTime(formatTime(Math.max(0, duration - currentTime)));
    }
  }, [currentTime, isDragging, seeking, duration]);
  
  // Handle slider value change with control interaction
  const handleSliderValueChange = useCallback((value: number) => {
    onControlInteraction();
    setIsDragging(true);
    setDisplayTime(value); // Update display time directly during dragging
    setLastDraggedValue(value); // Store the dragged value
    
    // Only update the thumbnail position, not the displayed time
    onSliderValueChange(value);
  }, [onControlInteraction, onSliderValueChange]);

  // Handle slider sliding complete with control interaction
  const handleSliderSlidingComplete = useCallback((value: number) => {
    onControlInteraction();
    setIsDragging(false);
    setLastDraggedValue(value); // Ensure we keep track of the last position
    // Update displayed remaining time when sliding completes
    setDisplayedRemainingTime(formatTime(Math.max(0, duration - value)));
    onSliderSlidingComplete(value);
  }, [onControlInteraction, onSliderSlidingComplete, duration]);

  // Optimize thumbnail position calculation, especially important for iPad performance
  const thumbnailPosition = useMemo(() => {
    // Pass the current dragged/displayed time for accurate positioning
    const timeToUse = isDragging || seeking ? displayTime : currentTime;
    return getThumbnailPosition(timeToUse);
  }, [
    // Reduce dependency list to minimum required for accurate calculation
    displayTime, 
    currentTime,
    isDragging,
    seeking,
    getThumbnailPosition
  ]);

  // Memoize slider value to reduce re-renders
  const sliderValue = useMemo(() => {
    // Use last dragged value when available to prevent jumping back
    if (lastDraggedValue !== null && (isDragging || seeking)) {
      return lastDraggedValue;
    }
    return isDragging ? displayTime : currentTime;
  }, [isDragging, displayTime, currentTime, lastDraggedValue, seeking]);

  // Memoize thumbnail props to prevent unnecessary re-renders
  const thumbnailProps = useMemo(() => ({
    currentTime: displayTime,
    position: thumbnailPosition,
    opacity: thumbnailOpacity,
    dynamicStyles: dynamicStyles
  }), [displayTime, thumbnailPosition, thumbnailOpacity, dynamicStyles]);

  // Memoize styles to prevent object recreation
  const containerStyle = useMemo(() => 
    [styles.seekbarContainer, dynamicStyles.seekbarContainer],
    [dynamicStyles.seekbarContainer]
  );

  const sliderStyle = useMemo(() => 
    [styles.seekbar, dynamicStyles.seekbar],
    [dynamicStyles.seekbar]
  );

  const timeTextStyle = useMemo(() => 
    [styles.timeText, dynamicStyles.timeText],
    [dynamicStyles.timeText]
  );

  // Memoize layout handler to prevent recreation on each render
  const handleLayout = useCallback((event: { nativeEvent: { layout: { width: number } } }) => {
    const { width } = event.nativeEvent.layout;
    // Set the slider width, accounting for any padding that might affect positioning
    setSliderWidth(width);
  }, [setSliderWidth]);

  return (
    <View
      style={containerStyle}
      onLayout={handleLayout}
    >
      {/* Thumbnail preview is positioned absolutely relative to this container */}
      {seeking && <ThumbnailPreview {...thumbnailProps} />}

      {/* Slider to control video position */}
      <View style={{flex: 1, position: 'relative'}}>
        <Slider
          style={sliderStyle}
          minimumValue={0}
          maximumValue={duration}
          value={sliderValue}
          onValueChange={handleSliderValueChange}
          onSlidingComplete={handleSliderSlidingComplete}
          minimumTrackTintColor="#E50914" // Netflix red
          maximumTrackTintColor="#888888"
          thumbTintColor="#E50914"
          tapToSeek={true} // Enable tap to seek for better UX
        />
      </View>
      
      {/* Only show remaining time using the cached formatted value */}
      <Text style={timeTextStyle}>{displayedRemainingTime}</Text>
    </View>
  );
};

export default React.memo(SeekBar); 