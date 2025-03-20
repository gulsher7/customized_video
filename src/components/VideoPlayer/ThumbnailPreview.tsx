import React, { useMemo } from 'react';
import { Animated, View, Text } from 'react-native';
import { styles } from './styles';
import { formatTime } from '../../utils/timeFormatter';

interface ThumbnailPreviewProps {
  currentTime: number;
  position: number;
  opacity: Animated.Value;
  dynamicStyles: any;
}

const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  currentTime,
  position,
  opacity,
  dynamicStyles,
}) => {
  // Get the thumbnail width for proper centering
  const thumbnailWidth = dynamicStyles.thumbnailContent.width;
  
  // Calculate thumbnail styles, including transforms
  const thumbnailStyles = useMemo(() => {
    // Create transform array with horizontal centering
    const transforms = [{ translateX: -(thumbnailWidth / 2) }];
    
    return {
      // Position the preview at the calculated position
      left: position,
      opacity: opacity,
      // Ensure perfect centering by precisely translating half the width
      transform: transforms,
      // Add a stable bottom position to prevent vertical jumping
      position: 'absolute',
      zIndex: 10000,
    };
  }, [position, opacity, thumbnailWidth]);
  
  // Memoize arrow styles to prevent recreation
  const arrowStyles = useMemo(() => 
    [styles.thumbnailArrow, { alignSelf: 'center' as const }],
    []
  );
  
  return (
    <Animated.View
      style={[
        styles.thumbnailPreview,
        dynamicStyles.thumbnailPreview,
        thumbnailStyles
      ]}
      pointerEvents="none"
    >
      <View style={[styles.thumbnailContent, dynamicStyles.thumbnailContent]}>
        <Text style={[styles.thumbnailTimestamp, dynamicStyles.thumbnailTimestamp]}>
          {formatTime(currentTime)}
        </Text>
      </View>
      {/* Center the arrow under the thumbnail */}
      <View style={arrowStyles} />
    </Animated.View>
  );
};

export default ThumbnailPreview; 