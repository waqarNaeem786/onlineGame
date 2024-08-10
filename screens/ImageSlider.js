import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const images = [
  'https://offerwall.ettaleby.com/assets/images/slide.png',
  'https://offerwall.ettaleby.com/assets/images/slide.png',
  'https://offerwall.ettaleby.com/assets/images/slide.png',
  'https://offerwall.ettaleby.com/assets/images/slide.png',
];

const ImageSlider = () => {
  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={width}
        height={100}
        autoPlay={true}
        autoPlayInterval={1000}
        data={images}
        scrollAnimationDuration={1000}
        renderItem={renderItem}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 100,
        }}
      />
      <Carousel
        loop
        width={width}
        height={100}
        autoPlay={true}
        autoPlayInterval={1000}
        data={images}
        scrollAnimationDuration={1000}
        renderItem={renderItem}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 100,
        }}
        style={{ transform: [{ rotateY: '180deg' }] }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width, // Adjust to fit more items
    height: 50,
  },
});

export default ImageSlider;
