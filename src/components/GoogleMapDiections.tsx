import { Icons } from 'assets/icons';
import React from 'react';
import { Button, Linking, Alert, TouchableOpacity, Text, View, Platform } from 'react-native';

const OpenGoogleMapsDirections = ({
  origin,
  destination,
}: {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
}): JSX.Element => {
  const openGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}`;
    const appleMapsUrl = `http://maps.apple.com/?saddr=${origin.latitude},${origin.longitude}&daddr=${destination.latitude},${destination.longitude}`;

    if (Platform.OS === 'android') {
      // Mở Google Maps trên Android
      Linking.canOpenURL(googleMapsUrl)
        .then(supported => {
          if (supported) {
            Linking.openURL(googleMapsUrl);
          } else {
            Alert.alert('Không thể mở ứng dụng Google Maps');
          }
        })
        .catch(err => Alert.alert('Lỗi xảy ra', err));
    } else if (Platform.OS === 'ios') {
      // Mở Apple Maps trên iOS
      Linking.canOpenURL(appleMapsUrl)
        .then(supported => {
          if (supported) {
            Linking.openURL(appleMapsUrl);
          } else {
            Alert.alert('Không thể mở ứng dụng Apple Maps');
          }
        })
        .catch(err => Alert.alert('Lỗi xảy ra', err));
    }
  };

  return (
    // <View
    //   style={{
    //     position: 'absolute',
    //     bottom: 50,
    //     right: 40,
    //     height: 48,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     zIndex: 10000,
    //   }}>
    <TouchableOpacity
      onPress={openGoogleMaps}
      style={{
        paddingHorizontal: 4,
        width: 40,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Icons.DirectionGoogleMap />
      {/* <Text style={{color: 'black'}}>Chỉ đường bằng Google Maps</Text> */}
    </TouchableOpacity>
    // </View>
  );
};

export default OpenGoogleMapsDirections;
