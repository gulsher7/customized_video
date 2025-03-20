import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { View, TouchableWithoutFeedback, Platform } from 'react-native';
import { styles } from './styles';
import TopBar from './TopBar';
import PlaybackControls from './PlaybackControls';
import SeekBar from './SeekBar';
import BottomBar from './BottomBar';
import { UseVideoPlayerReturn } from '../../hooks/useVideoPlayer';
import { initialIsTablet } from '../../utils/deviceUtils';

interface VideoControlsProps extends UseVideoPlayerReturn {
  dynamicStyles: any;
}

const VideoControls: React.FC<VideoControlsProps> = (props) => {
  const {
    paused,
    setPaused,
    currentTime,
    duration,
    seeking,
    thumbnailOpacity,
    isLocked,
    playbackRate,
    sliderWidth,
    setSliderWidth,
    setIsLocked,
    skipBackward,
    skipForward,
    toggleSpeed,
    onSliderValueChange,
    onSliderSlidingComplete,
    getThumbnailPosition,
    dynamicStyles,
    setShowControls
  } = props;

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isControlInteractionRef = useRef(false);
  
  // Longer hide timeout for iPad for better usability on larger screens
  const hideDelay = initialIsTablet ? 8000 : 5000; // 8 seconds for iPad, 5 for phones

  // Function to start or restart the hide timer
  const startHideTimer = useCallback(() => {
    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    // Set new timeout to hide controls after the appropriate delay
    hideTimeoutRef.current = setTimeout(() => {
      // Only hide if not paused, not seeking, and not interacting with controls
      if (!paused && !seeking && !isControlInteractionRef.current) {
        setShowControls(false);
      }
    }, hideDelay);
  }, [paused, seeking, setShowControls, hideDelay]);

  // Auto-hide controls after inactivity if no interaction is happening
  useEffect(() => {
    // Only start the hide timer if no control is being interacted with
    if (!isControlInteractionRef.current) {
      startHideTimer();
    }

    // Clear timeout when component unmounts
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [paused, seeking, startHideTimer]);

  // Reset timer when user taps on the video surface (background)
  const handleBackgroundInteraction = useCallback(() => {
    // Reset the control interaction flag since user tapped on background
    isControlInteractionRef.current = false;
    // Start hide timer
    startHideTimer();
  }, [startHideTimer]);

  // Called when user interacts with any control
  const handleControlInteraction = useCallback(() => {
    // Set the flag to indicate control interaction is happening
    isControlInteractionRef.current = true;
    
    // Clear any existing hide timeout to prevent controls from disappearing
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  }, []);

  // Memoize props for child components to prevent unnecessary renders
  const topBarProps = useMemo(() => ({
    title: "Video Title",
    isLocked,
    setIsLocked,
    onControlInteraction: handleControlInteraction
  }), [isLocked, setIsLocked, handleControlInteraction]);

  const playbackControlsProps = useMemo(() => ({
    paused,
    setPaused,
    skipBackward,
    skipForward,
    dynamicStyles,
    onControlInteraction: handleControlInteraction
  }), [paused, setPaused, skipBackward, skipForward, dynamicStyles, handleControlInteraction]);

  const seekBarProps = useMemo(() => ({
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
    onControlInteraction: handleControlInteraction
  }), [
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
    handleControlInteraction
  ]);

  const bottomBarProps = useMemo(() => ({
    playbackRate,
    toggleSpeed,
    onControlInteraction: handleControlInteraction
  }), [playbackRate, toggleSpeed, handleControlInteraction]);

  // Memoize style combinations to prevent object recreation
  const centerControlsStyle = useMemo(() => 
    [styles.centerControls, dynamicStyles.centerControls],
    [dynamicStyles.centerControls]
  );

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundInteraction}>
      <View style={styles.controlsOverlay}>
        {/* Top row - title and buttons */}
        <TopBar {...topBarProps} />

        {/* Center controls */}
        <View style={centerControlsStyle}>
          {/* Playback controls */}
          <PlaybackControls {...playbackControlsProps} />
        </View>

        {/* Bottom row - seekbar and buttons */}
        <View style={styles.bottomRow}>
          {/* Seekbar */}
          <SeekBar {...seekBarProps} />

          {/* Bottom buttons */}
          <BottomBar {...bottomBarProps} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(VideoControls); 