import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { styles } from './styles';
import TopBar from './TopBar';
import PlaybackControls from './PlaybackControls';
import SeekBar from './SeekBar';
import BottomBar from './BottomBar';
import { UseVideoPlayerReturn } from '../../hooks/useVideoPlayer';

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

  // Function to start or restart the hide timer
  const startHideTimer = useCallback(() => {
    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    // Set new timeout to hide controls after 5 seconds
    hideTimeoutRef.current = setTimeout(() => {
      // Only hide if not paused, not seeking, and not interacting with controls
      if (!paused && !seeking && !isControlInteractionRef.current) {
        setShowControls(false);
      }
      // Reset the interaction flag after the timer fires
      isControlInteractionRef.current = false;
    }, 5000);
  }, [paused, seeking, setShowControls]);

  // Auto-hide controls after 5 seconds of inactivity
  useEffect(() => {
    // Start timer when component mounts or when paused/seeking state changes
    startHideTimer();

    // Clear timeout when component unmounts
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [paused, seeking, startHideTimer]);

  // Reset timer when user interacts with the video surface (background)
  const handleBackgroundInteraction = useCallback(() => {
    // Only restart the timer if we're not interacting with controls
    if (!isControlInteractionRef.current) {
      startHideTimer();
    }
    // Reset the flag after handling the background interaction
    isControlInteractionRef.current = false;
  }, [startHideTimer]);

  // Called when user interacts with any control
  const handleControlInteraction = useCallback(() => {
    // Set the flag to indicate control interaction
    isControlInteractionRef.current = true;
    // Restart the hide timer
    startHideTimer();
  }, [startHideTimer]);

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