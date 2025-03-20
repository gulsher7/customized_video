import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';

interface PlaybackControlsProps {
  paused: boolean;
  setPaused: (paused: boolean) => void;
  skipBackward: () => void;
  skipForward: () => void;
  dynamicStyles: any;
  onControlInteraction: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  paused,
  setPaused,
  skipBackward,
  skipForward,
  dynamicStyles,
  onControlInteraction
}) => {
  // Handle button press with control interaction - memoize to prevent recreation
  const handleButtonPress = useCallback((action: () => void) => {
    onControlInteraction();
    action();
  }, [onControlInteraction]);

  // Memoize handlers for specific actions
  const handleSkipBackward = useCallback(() => {
    handleButtonPress(skipBackward);
  }, [handleButtonPress, skipBackward]);

  const handlePlayPause = useCallback(() => {
    handleButtonPress(() => setPaused(!paused));
  }, [handleButtonPress, setPaused, paused]);

  const handleSkipForward = useCallback(() => {
    handleButtonPress(skipForward);
  }, [handleButtonPress, skipForward]);

  // Memoize style combinations to prevent object recreation
  const containerStyle = useMemo(() => 
    [styles.playbackControls, dynamicStyles.playbackControls],
    [dynamicStyles.playbackControls]
  );

  // Memoize play/pause icon name to prevent recreation
  const playPauseIconName = useMemo(() => paused ? "play" : "pause", [paused]);

  return (
    <View style={containerStyle}>
      <TouchableOpacity 
        onPress={handleSkipBackward}
        style={styles.skipButton}
      >
        <Icon name="reload-outline" size={34} color="#FFF" />
        <Text style={styles.skipText}>10</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePlayPause}>
        <Icon 
          name={playPauseIconName} 
          size={50} 
          color="#FFF" 
          style={{ marginHorizontal: 30 }}
        />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleSkipForward}
        style={styles.skipButton}
      >
        <Icon name="reload-outline" size={34} color="#FFF" />
        <Text style={styles.skipText}>10</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(PlaybackControls); 