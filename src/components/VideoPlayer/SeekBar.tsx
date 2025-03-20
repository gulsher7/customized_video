import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Text, View, LayoutChangeEvent } from 'react-native';
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
  // Store slider track layout for proper thumbnail positioning
  const [sliderTrackWidth, setSliderTrackWidth] = useState(0);
  const [sliderTrackX, setSliderTrackX] = useState(0);
  const [containerPaddingLeft, setContainerPaddingLeft] = useState(0);
  const [timeTextWidth, setTimeTextWidth] = useState(0);
  const sliderViewRef = useRef(null);
  
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

  // Handle time text layout to calculate its width
  const handleTimeTextLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTimeTextWidth(width);
  }, []);

  // Calculate the horizontal offset needed for accurate thumbnail positioning
  const horizontalOffset = useMemo(() => {
    // Include the padding, time text width, and slider horizontal margin
    const offset = containerPaddingLeft + timeTextWidth + dynamicStyles.seekbar.marginHorizontal;
    
    // Return the offset
    return offset;
  }, [containerPaddingLeft, timeTextWidth, dynamicStyles.seekbar.marginHorizontal]);

  // Optimize thumbnail position calculation, especially important for iPad performance
  const thumbnailPosition = useMemo(() => {
    // Pass the current dragged/displayed time for accurate positioning
    const timeToUse = isDragging || seeking ? displayTime : currentTime;
    
    // Calculate raw position as percentage of slider width
    const percentage = timeToUse / duration;
    
    // Calculate the actual horizontal position including offsets
    // First get the slider track width (without the time displays)
    const actualSliderWidth = sliderTrackWidth - (2 * timeTextWidth);
    
    // Now calculate the position within the slider
    const positionInSlider = percentage * actualSliderWidth;
    
    // Add the horizontal offset to get the absolute position
    return horizontalOffset + positionInSlider;
  }, [
    displayTime, 
    currentTime,
    isDragging,
    seeking,
    duration,
    sliderTrackWidth,
    timeTextWidth,
    horizontalOffset
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
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, x } = event.nativeEvent.layout;
    // Calculate the left padding/margin from the container's layout
    setContainerPaddingLeft(x);
    // Set the slider width for overall use
    setSliderWidth(width);
    setSliderTrackWidth(width);
    setSliderTrackX(x);
  }, [setSliderWidth]);

  // Handle slider view layout
  const handleSliderViewLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    // This is the actual width of the slider container
    setSliderTrackWidth(width);
  }, []);

  // Show thumbnail only when dragging/seeking
  const shouldShowThumbnail = isDragging || seeking;

  return (
    <View
      style={containerStyle}
      onLayout={handleLayout}
    >
      {/* Thumbnail preview is positioned absolutely relative to this container */}
      {shouldShowThumbnail && <ThumbnailPreview {...thumbnailProps} />}

      {/* Time display for current position */}
      {/* <Text 
        style={timeTextStyle}
        onLayout={handleTimeTextLayout}
      >
        {formatTime(isDragging ? displayTime : currentTime)}
      </Text> */}

      {/* Slider to control video position */}
      <View 
        style={{flex: 1, position: 'relative' as const}}
        ref={sliderViewRef}
        onLayout={handleSliderViewLayout}
      >
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
      
      {/* Time display for remaining time */}
      <Text style={timeTextStyle}>
        {displayedRemainingTime}
      </Text>
    </View>
  );
};

export default React.memo(SeekBar); 