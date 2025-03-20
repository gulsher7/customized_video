import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';

// Mock data
const movieData = {
  title: 'The Electric State',
  year: '2025',
  ageRating: 'U/A 13+',
  duration: '2h 8m',
  badges: [
    { label: 'HD' },
    { label: 'AD' },
  ],
  ranking: '#5 in Movies Today',
  description: 'Millie Bobby Brown and Chris Pratt star in this retro-futuristic adventure about an orphaned teen\'s journey to find her brother after a robot rebellion.',
  cast: 'Cast: Millie Bobby Brown, Chris Pratt, Ke Huy Quan',
  directors: 'Directors: Anthony Russo, Joe Russo',
  remainingTime: '2h 7m remaining',
  progress: 0.30, // 30% watched
  posterUri: 'https://i.imgur.com/JRfRRQV.jpg', // Replace with actual image URL
};

const similarMovies = [
  { id: '1', posterUri: 'https://i.imgur.com/iyvF8xO.jpg' },
  { id: '2', posterUri: 'https://i.imgur.com/7TOHa0t.jpg' },
  { id: '3', posterUri: 'https://i.imgur.com/XPHZhJD.jpg' },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  // Lock to portrait orientation for the home screen
  // useEffect(() => {
  //   Orientation.lockToPortrait();
  //   return () => {
  //     // No need to unlock as we'll lock to landscape when playing video
  //   };
  // }, []);

  const handlePlayPress = () => {
    // Lock to landscape when playing video
    // Orientation.lockToLandscape();
    // Navigate to video player screen
    // Orientation.lockToLandscapeLeft();
    navigation.navigate('VideoPlayer');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView style={styles.scrollView}>
        <View style={styles.posterContainer}>
          <ImageBackground 
            source={{ uri: movieData.posterUri }} 
            style={styles.poster}
          >
            <View style={styles.topButtons}>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="cast-outline" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="lock-closed-outline" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Play button overlay in the center of the poster */}
            <View style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <TouchableOpacity
                onPress={handlePlayPress}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Icon name="play" size={40} color="#FFF" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.contentContainer}>
          {/* Netflix and FILM label */}
          <View style={styles.netflixRow}>
            <Image 
              source={{ uri: 'https://i.imgur.com/aFSb6uK.png' }} 
              style={styles.netflixLogo} 
            />
            <Text style={styles.filmLabel}>FILM</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{movieData.title}</Text>

          {/* Metadata */}
          <View style={styles.metadataRow}>
            <Text style={styles.year}>{movieData.year}</Text>
            <Text style={styles.ageRating}>{movieData.ageRating}</Text>
            <Text style={styles.duration}>{movieData.duration}</Text>
            {movieData.badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{badge.label}</Text>
              </View>
            ))}
          </View>

          {/* Ranking */}
          <Text style={styles.rankingText}>{movieData.ranking}</Text>

          {/* Play/Resume and Download buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={handlePlayPress}
            >
              <Icon name="play" size={22} color="#000" />
              <Text style={styles.playButtonText}>Resume</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.downloadButton}>
              <Icon name="arrow-down" size={22} color="#FFF" />
              <Text style={styles.downloadButtonText}>Download</Text>
            </TouchableOpacity>
          </View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${movieData.progress * 100}%` }]} />
          </View>
          <Text style={styles.remainingText}>{movieData.remainingTime}</Text>

          {/* Description */}
          <Text style={styles.description}>{movieData.description}</Text>

          {/* Cast and Directors */}
          <Text style={styles.castText}>{movieData.cast}</Text>
          <Text style={styles.castText}>{movieData.directors}</Text>

          {/* Action buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="add" size={24} color="#FFF" />
              <Text style={styles.actionButtonText}>My List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="thumbs-up-outline" size={24} color="#FFF" />
              <Text style={styles.actionButtonText}>Rate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="share-outline" size={24} color="#FFF" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* More Like This */}
          <View>
            <View style={styles.sectionTabs}>
              <TouchableOpacity style={styles.activeTab}>
                <Text style={styles.tabText}>More Like This</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inactiveTab}>
                <Text style={styles.inactiveTabText}>Trailers & More</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.thumbnailsRow}>
              {similarMovies.map((movie) => (
                <TouchableOpacity key={movie.id}>
                  <Image 
                    source={{ uri: movie.posterUri }} 
                    style={styles.thumbnail} 
                  />
                  <Image 
                    source={{ uri: 'https://i.imgur.com/aFSb6uK.png' }} 
                    style={styles.netflixBadge}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen; 