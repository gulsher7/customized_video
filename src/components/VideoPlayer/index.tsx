import React, { useEffect, useMemo, useCallback } from 'react';
import { StatusBar, useWindowDimensions, View, BackHandler } from 'react-native';
import { GestureDetector, GestureHandlerRootView, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import Video from 'react-native-video';
import { styles } from './styles';
import { createDynamicStyles } from './styles';
import useVideoPlayer, { videoUri } from '../../hooks/useVideoPlayer';
import VideoControls from './VideoControls';
import { isLandscape, isTablet } from '../../utils/deviceUtils';
import Orientation, { LANDSCAPE_LEFT, OrientationLocker } from 'react-native-orientation-locker';
import { useNavigation } from '@react-navigation/native';

const VideoPlayer: React.FC = () => {
  // Get current dimensions to handle orientation changes
  const { width, height } = useWindowDimensions();
  const currentIsTablet = useMemo(() => isTablet(width, height), [width, height]);
  const currentIsLandscape = useMemo(() => isLandscape(width, height), [width, height]);
  const navigation = useNavigation();

  // Video player hook
  const videoPlayerProps = useVideoPlayer();
  const {
    videoRef,
    paused,
    currentTime,
    duration,
    showControls,
    seeking,
    playbackRate,
    isMuted,
    isFullscreen,
    toggleControls,
    setCurrentTime,
    setDuration,
    setPaused,
    setShowControls
  } = videoPlayerProps;

  // Lock to landscape orientation
  useEffect(() => {
    Orientation.lockToLandscape();

    // Handle hardware back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return to home screen
      Orientation.lockToPortrait();
      navigation.goBack();
      return true;
    });

    // Auto-play when component mounts
    setPaused(false);

    return () => {
      // Clean up event listener
      backHandler.remove();
      Orientation.lockToPortrait();
    };
  }, [navigation]);

  // Calculate dynamic styles based on device type and orientation
  const dynamicStyles = useMemo(() =>
    createDynamicStyles(currentIsTablet, currentIsLandscape),
    [currentIsTablet, currentIsLandscape]);

  // Reset controls visibility timer on user interaction
  const handleVideoPress = useCallback(() => {
    if (!showControls) {
      setShowControls(true);
    } else {
      toggleControls();
    }
  }, [showControls, setShowControls, toggleControls]);

  // Memoize the tap gesture to prevent recreation on each render
  const tapGesture = useMemo(() => 
    Gesture.Tap().onEnd(() => {
      runOnJS(handleVideoPress)();
    }), 
    [handleVideoPress]
  );

  // Memoize video event handlers
  const handleVideoLoad = useCallback((data: { duration: number }) => {
    setDuration(data.duration);
  }, [setDuration]);

  const handleVideoProgress = useCallback((data: { currentTime: number }) => {
    if (!seeking) {
      setCurrentTime(data.currentTime);
    }
  }, [seeking, setCurrentTime]);

  const handleVideoEnd = useCallback(() => {
    setPaused(true);
  }, [setPaused]);

  return (
    <View style={{ flex: 1 }}>
      {/* <OrientationLocker orientation={LANDSCAPE_LEFT} /> */}
      <GestureHandlerRootView style={styles.container}>
        <StatusBar hidden={true} />

        <GestureDetector gesture={tapGesture}>
          <View style={[styles.videoContainer, dynamicStyles.videoContainer]}>
            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              style={styles.video}
              resizeMode="cover"
              paused={paused}
              rate={playbackRate}
              muted={isMuted}
              onLoad={handleVideoLoad}
              fullscreen={false}
              onProgress={handleVideoProgress}
              onEnd={handleVideoEnd}
              bufferConfig={{
                minBufferMs: 15000,
                maxBufferMs: 50000,
                bufferForPlaybackMs: 2500,
                bufferForPlaybackAfterRebufferMs: 5000
              }}
            />

            {showControls && (
              <VideoControls
                {...videoPlayerProps}
                dynamicStyles={dynamicStyles}
              />
            )}
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
};

export default React.memo(VideoPlayer); 