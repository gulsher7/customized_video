import { Platform, StyleSheet } from 'react-native';
import { initialIsTablet } from '../../utils/deviceUtils';

export const createDynamicStyles = (isTablet: boolean, isLandscape: boolean) => {
  // Calculate the correct sizes for thumbnails based on device
  const thumbnailWidth = isTablet ? 120 : 80;
  const thumbnailHeight = isTablet ? 70 : 45;

  return {
    videoContainer: {
      // Only add minimal padding for iPad landscape to prevent excessive white space
      paddingHorizontal: isTablet && isLandscape ? 20 : 0,
    },
    centerControls: {
      paddingHorizontal: isTablet ? 64 : 16,
    },
    playbackControls: {
      width: isTablet ? 300 : 220,
    },
    seekbarContainer: {
      paddingHorizontal: isTablet ? 30 : 15,
      marginBottom: isTablet ? 16 : 8,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
    },
    timeText: {
      fontSize: isTablet ? 18 : 14,
      width: isTablet ? 70 : 50,
    },
    seekbar: {
      height: isTablet ? 40 : 30,
      marginHorizontal: isTablet ? 15 : 5,
      flex: 1,
    },
    sliderThumbStyle: {
      width: isTablet ? 24 : 16,
      height: isTablet ? 24 : 16,
      borderRadius: isTablet ? 12 : 8,
    },
    controlsOverlay: {
      padding: isTablet ? 24 : 16,
    },
    topRow: {
      marginBottom: isTablet ? 20 : 10,
    },
    title: {
      fontSize: isTablet ? 22 : 18,
    },
    skipText: {
      fontSize: isTablet ? 16 : 12,
    },
    bottomButtons: {
      paddingHorizontal: isTablet ? 24 : 16,
      marginBottom: isTablet ? 12 : 6,
    },
    speedButton: {
      padding: isTablet ? 12 : 8,
    },
    subtitlesButton: {
      padding: isTablet ? 12 : 8,
    },
    buttonText: {
      fontSize: isTablet ? 16 : 14,
    },
    thumbnailContent: {
      width: thumbnailWidth,
      height: thumbnailHeight,
      backgroundColor: '#000',
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: '#E50914',
    },
    thumbnailTimestamp: {
      fontSize: isTablet ? 20 : 16,
      color: '#FFFFFF',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    thumbnailPreview: {
      // Position further above the seekbar on iPad
      bottom: isTablet ? 60 : 45,
      // Make the thumbnail more visible and properly positioned
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      // Add shadow for better visibility
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
        },
        android: {
          elevation: 5,
        },
      }),
    }
  };
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000', // Ensure background is black to prevent white space
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000', // Black background for the video component
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
  },
  leftArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  topButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    color: '#FFFFFF',
    marginTop: -24,
    right: 2,
  },
  bottomRow: {
    width: '100%',
  },
  seekbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  timeText: {
    color: '#FFFFFF',
    textAlign: 'center',
    width: 50,
  },
  seekbar: {
    flex: 1,
    height: 30,
  },
  bottomButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:'center',
    paddingBottom: 24,
    gap: 16
  },
  speedButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitlesButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 8,
  },
  speedText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  thumbnailPreview: {
    position: 'absolute',
    bottom: 45,
    alignItems: 'center',
    zIndex: 10,
    margin: 0,
    padding: 0,
    justifyContent: 'center',
  },
  thumbnailContent: {
    backgroundColor: '#000',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E50914',
    width: 80,
    height: 45,
  },
  thumbnailTimestamp: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
  },
  thumbnailArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E50914',
    alignSelf: 'center',
    marginTop: -1,
  },
  textView: {
    width: 50
  }
}); 