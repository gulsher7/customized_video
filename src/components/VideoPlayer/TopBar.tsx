import React, { useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';

interface TopBarProps {
  title: string;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  onControlInteraction: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  isLocked,
  setIsLocked,
  onControlInteraction
}) => {
  const navigation = useNavigation(); 
  
  // Wrapper for button press that handles both the action and control interaction
  const handleButtonPress = useCallback((action: () => void) => {
    onControlInteraction();
    action();
  }, [onControlInteraction]);

  // Memoize handlers for specific actions
  const handleLockToggle = useCallback(() => {
    handleButtonPress(() => setIsLocked(!isLocked));
  }, [handleButtonPress, setIsLocked, isLocked]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Memoize lock icon name to prevent recreation
  const lockIconName = useMemo(() => isLocked ? "lock-closed" : "lock-open", [isLocked]);

  return (
    <View style={styles.topRow}>
      <View style={styles.leftArea}>
        <Text style={styles.title}>{'P1:E1 "Chapter 1: Homecoming"'}</Text>
      </View>
      <View style={styles.topButtons}>
        <TouchableOpacity 
          style={{marginLeft: 10}}
          onPress={handleLockToggle}
        >
          <Icon name={lockIconName} size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{marginLeft: 10}}
          onPress={handleClose}
        >
          <Icon name="close" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(TopBar); 