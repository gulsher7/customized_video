import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const posterWidth = width;
const posterHeight = width * 0.6; // 16:9 aspect ratio

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  posterContainer: {
    width: posterWidth,
    height: posterHeight,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  posterGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'transparent',
  },
  topButtons: {
    position: 'absolute',
    top: 40,
    right: 15,
    flexDirection: 'row',
    zIndex: 10,
  },
  iconButton: {
    marginLeft: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  netflixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  netflixLogo: {
    width: 20,
    height: 40,
    resizeMode: 'contain',
  },
  filmLabel: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginLeft: 10,
    letterSpacing: 1,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  year: {
    color: 'white',
    fontSize: 16,
  },
  ageRating: {
    color: '#ccc',
    fontSize: 14,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 10,
  },
  duration: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
  badge: {
    backgroundColor: '#333',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
    borderRadius: 3,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
  rankingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  playButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  playButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  downloadButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressContainer: {
    height: 3,
    backgroundColor: '#333',
    borderRadius: 2,
    marginVertical: 15,
  },
  progressBar: {
    height: '100%',
    width: '30%', // Example progress
    backgroundColor: '#E50914',
    borderRadius: 2,
  },
  remainingText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 10,
  },
  description: {
    color: 'white',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
  castText: {
    color: '#bbb',
    fontSize: 13,
    marginBottom: 5,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    marginBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 10,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  actionButtonText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionTabs: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E50914',
    marginRight: 20,
  },
  inactiveTab: {
    marginRight: 20,
  },
  tabText: {
    color: 'white',
    fontSize: 16,
    paddingBottom: 5,
  },
  inactiveTabText: {
    color: '#999',
    fontSize: 16,
    paddingBottom: 5,
  },
  thumbnailsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  thumbnail: {
    width: width / 3 - 15,
    height: (width / 3 - 15) * 1.5,
    marginRight: 10,
    borderRadius: 5,
  },
  netflixBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 20,
    height: 20,
  }
}); 