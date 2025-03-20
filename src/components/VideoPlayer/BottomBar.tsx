import React, { useCallback, useMemo } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';

interface BottomBarProps {
  playbackRate: number;
  toggleSpeed: () => void;
  onControlInteraction: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  playbackRate,
  toggleSpeed,
  onControlInteraction
}) => {
  // Handle button press with control interaction
  const handleButtonPress = useCallback((action: () => void) => {
    onControlInteraction();
    action();
  }, [onControlInteraction]);

  // Memoize specific handlers to prevent recreation
  const handleSpeedToggle = useCallback(() => {
    handleButtonPress(toggleSpeed);
  }, [handleButtonPress, toggleSpeed]);

  const handleControlInteraction = useCallback(() => {
    onControlInteraction();
  }, [onControlInteraction]);

  // Memoize text content to prevent string concatenation on each render
  const speedText = useMemo(() => `Speed (${playbackRate}x)`, [playbackRate]);

  // Memoize style objects to prevent recreation
  const nextEpButtonTextStyle = useMemo(() => ({
    ...styles.buttonText, 
    marginLeft: 0
  }), []);

  return (
    <View style={styles.bottomButtons}>
      <TouchableOpacity 
        onPress={handleSpeedToggle} 
        style={styles.speedButton}
      >
        <Icon name="speedometer-outline" size={24} color="#FFF" />
        <Text style={styles.buttonText}>{speedText}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.subtitlesButton}
        onPress={handleControlInteraction}
      >
        <Icon name="list-outline" size={24} color="#FFF" />
        <Text style={styles.buttonText}>Episodes</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.subtitlesButton}
        onPress={handleControlInteraction}
      >
        <Icon name="text-outline" size={24} color="#FFF" />
        <Text style={styles.buttonText}>Audio & Subtitles</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.subtitlesButton}
        onPress={handleControlInteraction}
      >
        <Icon name="play-skip-forward-outline" size={24} color="#FFF" />
        <Text style={nextEpButtonTextStyle}>Next Ep.</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(BottomBar); 