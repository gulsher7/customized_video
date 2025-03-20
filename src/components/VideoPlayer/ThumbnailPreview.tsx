import React, { useRef, useEffect, useMemo } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { styles } from './styles';
import { formatTime } from '../../utils/timeFormatter';
import { videoUri } from '../../hooks/useVideoPlayer';

interface ThumbnailPreviewProps {
  currentTime: number;
  position: number;
  opacity: Animated.Value;
  dynamicStyles: any;
}

// Custom time formatter to match the exact format in the image (40:48)
const formatExactTime = (seconds: number): string => {
  if (isNaN(seconds)) return "00:00";

  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

// Performance-optimized ThumbnailPreview component
const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  currentTime,
  position,
  opacity,
  dynamicStyles,
}) => {
  // Reference to the preview video
  const previewVideoRef = useRef<VideoRef>(null);

  // Seek the video to the current time when it changes
  useEffect(() => {
    // Add a debounce timeout to prevent rapid seeking
    const seekTimeout = setTimeout(() => {
      if (previewVideoRef.current) {
        previewVideoRef.current.seek(currentTime);
      }
    }, 300); // 150ms delay before seeking

    // Cleanup timeout on unmount or when currentTime changes again
    return () => clearTimeout(seekTimeout);
  }, [currentTime]);

  // Get the thumbnail width for proper centering
  const thumbnailWidth = dynamicStyles.thumbnailContent.width;
  const thumbnailHeight = dynamicStyles.thumbnailContent.height;

  // Memoize the formatted time to prevent recalculation on every render
  const formattedTime = useMemo(() =>
    formatExactTime(currentTime),
    [currentTime]
  );

  // Calculate thumbnail styles for precise alignment with the slider thumb
  const thumbnailStyles = useMemo(() => ({
    position: 'absolute' as const,
    left: position,
    transform: [{ translateX: -(thumbnailWidth / 2) }],
    opacity: opacity,
    bottom: 40,
    zIndex: 10000,
  }), [position, opacity, thumbnailWidth]);

  // Custom styles for the exact design in the image
  const customContainerStyle = useMemo(() => ({
    width: thumbnailWidth,
    height: thumbnailHeight + 40,
    backgroundColor: 'transparent',
    alignItems: 'center' as const,
  }), [thumbnailWidth, thumbnailHeight]);

  // Custom video container style exactly matching the reference
  const videoContainerStyle = useMemo(() => ({
    width: thumbnailWidth,
    height: thumbnailHeight,
    borderRadius: 2,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#000',
  }), [thumbnailWidth, thumbnailHeight]);

  // Memoize video styles to prevent recreation
  const videoStyles = useMemo(() => ({
    width: thumbnailWidth,
    height: thumbnailHeight,
    position: 'absolute' as const,
    top: 0,
    left: 0,
  }), [thumbnailWidth, thumbnailHeight]);

  // Timestamp style to match the reference image exactly
  const timestampStyle = useMemo(() => ({
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    marginTop: 8,
  }), []);

  return (
    <Animated.View
      style={thumbnailStyles}
      pointerEvents="none"
    >
      <View style={customContainerStyle}>
        <View style={videoContainerStyle}>
          {/* Preview Video */}
          <Video
            ref={previewVideoRef}
            source={{
              uri: videoUri,
              bufferConfig: {
                minBufferMs: 5000,
                maxBufferMs: 15000,
                bufferForPlaybackMs: 1000,
                bufferForPlaybackAfterRebufferMs: 2000,
              }
            }}
            style={videoStyles}
            resizeMode="cover"
            paused={true}
            muted={true}
            repeat={true}
            playInBackground={false}
            disableFocus={true}
            progressUpdateInterval={1000}
          />
        </View>

        {/* Time display below the video */}
        <Text style={timestampStyle}>
          {formattedTime}
        </Text>
      </View>
    </Animated.View>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default React.memo(ThumbnailPreview); 