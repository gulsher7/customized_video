import { useEffect, useRef, useState } from 'react';
import { Animated, useWindowDimensions } from 'react-native';
import { VideoRef } from 'react-native-video';
import { initialIsTablet } from '../utils/deviceUtils';

// Video source
export const videoUri = "https://dx8pe6tczrh4v.cloudfront.net/4d4a03c3-6b8c-4e72-9025-59292c23e819/hls/Shera_4K_test_video.m3u8";

export interface UseVideoPlayerReturn {
  // Refs
  videoRef: React.RefObject<VideoRef>;
  thumbnailOpacity: Animated.Value;
  
  // States
  paused: boolean;
  currentTime: number;
  duration: number;
  showControls: boolean;
  seeking: boolean;
  isMuted: boolean;
  playbackRate: number;
  isLocked: boolean;
  isFullscreen: boolean;
  sliderWidth: number;
  
  // Functions
  setPaused: (paused: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setShowControls: (show: boolean) => void;
  setSeeking: (seeking: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setIsLocked: (locked: boolean) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setSliderWidth: (width: number) => void;
  
  // Actions
  toggleControls: () => void;
  skipForward: () => void;
  skipBackward: () => void;
  toggleSpeed: () => void;
  onSliderValueChange: (value: number) => void;
  onSliderSlidingComplete: (value: number) => void;
  getThumbnailPosition: (displayTimeOverride?: number) => number;
}

const useVideoPlayer = (): UseVideoPlayerReturn => {
  // Get current dimensions to handle orientation changes
  const { width } = useWindowDimensions();

  // Video ref
  const videoRef = useRef<VideoRef>(null);

  // States
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [seeking, setSeeking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isLocked, setIsLocked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);

  // Animation for thumbnail preview
  const thumbnailOpacity = useRef(new Animated.Value(0)).current;

  // Handle preview animation
  useEffect(() => {
    if (seeking) {
      Animated.timing(thumbnailOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(thumbnailOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [seeking]);

  // Toggle controls visibility
  const toggleControls = () => {
    if (!isLocked) {
      setShowControls(!showControls);
    }
  };

  // Skip forward/backward
  const skipForward = () => {
    const newTime = Math.min(currentTime + 10, duration);
    videoRef.current?.seek(newTime);
  };

  const skipBackward = () => {
    const newTime = Math.max(currentTime - 10, 0);
    videoRef.current?.seek(newTime);
  };

  // Toggle playback speed
  const toggleSpeed = () => {
    const speeds = [1.0, 1.5, 2.0];
    const nextIndex = speeds.indexOf(playbackRate) + 1;
    setPlaybackRate(speeds[nextIndex % speeds.length]);
  };

  // Handle seeking
  const onSliderValueChange = (value: number): void => {
    // Store this immediately for thumbnail preview
    const previousTime = currentTime;
    setSeeking(true);
    setCurrentTime(value);
  };

  const onSliderSlidingComplete = (value: number) => {
    // First update current time to the sought position to prevent UI jumps
    setCurrentTime(value);
    // Then request the video to seek to that position
    videoRef.current?.seek(value);
    // After a short delay, mark seeking as complete
    setTimeout(() => {
      setSeeking(false);
    }, 50);
  };

  // Update the getThumbnailPosition to use the current drag value
  const getThumbnailPosition = (displayTimeOverride?: number) => {
    if (duration === 0 || sliderWidth === 0) return 0;

    // If a specific display time is provided (from slider dragging), use that
    // Otherwise use the current time
    const timeForCalculation = displayTimeOverride !== undefined ? displayTimeOverride : currentTime;
    
    // Calculate the visible track width (excluding padding and thumb width)
    // Standard thumb width is approximately 24px for mobile, 30px for tablet
    const thumbWidth = initialIsTablet ? 30 : 24;
    const trackPadding = 16; // Standard slider padding
    
    // Usable slider width excluding thumb width and padding
    const usableTrackWidth = sliderWidth - (thumbWidth + trackPadding * 2);
    
    // Start position of the track (after left padding + half thumb width)
    const trackStartPosition = trackPadding + (thumbWidth / 2);
    
    // Calculate position including the offset
    const ratio = timeForCalculation / duration;
    const rawPosition = trackStartPosition + (ratio * usableTrackWidth);

    return rawPosition;
  };

  return {
    videoRef,
    thumbnailOpacity,
    paused,
    currentTime,
    duration,
    showControls,
    seeking,
    isMuted,
    playbackRate,
    isLocked,
    isFullscreen,
    sliderWidth,
    setPaused,
    setCurrentTime,
    setDuration,
    setShowControls,
    setSeeking,
    setIsMuted,
    setPlaybackRate,
    setIsLocked,
    setIsFullscreen,
    setSliderWidth,
    toggleControls,
    skipForward,
    skipBackward,
    toggleSpeed,
    onSliderValueChange,
    onSliderSlidingComplete,
    getThumbnailPosition,
  };
};

export default useVideoPlayer; 