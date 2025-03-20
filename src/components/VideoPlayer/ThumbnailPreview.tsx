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

// Performance-optimized ThumbnailPreview component
const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  currentTime,
  position,
  opacity,
  dynamicStyles,
}) => {
  // Get the thumbnail width for proper centering
  const thumbnailWidth = dynamicStyles.thumbnailContent.width;
  
  // Memoize the formatted time to prevent recalculation on every render
  const formattedTime = useMemo(() => 
    formatTime(currentTime), 
    [currentTime]
  );
  
  // Calculate thumbnail styles, including transforms
  const thumbnailStyles = useMemo(() => {
    return {
      // Position the preview precisely at the thumb position
      left: position,
      opacity: opacity,
      // Ensure perfect centering by precisely translating half the width
      transform: [{ translateX: -(thumbnailWidth / 2) }],
      // Add a stable bottom position to prevent vertical jumping
      position: 'absolute',
      zIndex: 10000,
    };
  }, [position, opacity, thumbnailWidth]);
  
  // Memoize content styles to prevent recreation
  const contentStyles = useMemo(() => 
    [styles.thumbnailContent, dynamicStyles.thumbnailContent],
    [dynamicStyles.thumbnailContent]
  );
  
  // Memoize text styles to prevent recreation
  const textStyles = useMemo(() => 
    [styles.thumbnailTimestamp, dynamicStyles.thumbnailTimestamp],
    [dynamicStyles.thumbnailTimestamp]
  );
  
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
      <View style={contentStyles}>
        <Text style={textStyles}>
          {formattedTime}
        </Text>
      </View>
      {/* Center the arrow under the thumbnail */}
      <View style={arrowStyles} />
    </Animated.View>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default React.memo(ThumbnailPreview); 