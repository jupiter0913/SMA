import React from 'react';
import { AsyncStorage, TouchableOpacity, FlatList, StyleSheet, StatusBar, Dimensions, Platform } from 'react-native';
import { Block, Button, Text, theme, Input } from 'galio-framework';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };

import Icon from '../components/Icon';
import { materialTheme } from '../constants';

const { height, width } = Dimensions.get('screen');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);


export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMap: true,
      selectedAddressData: '',
      selectedAddressDetail: '',
    };
  };

  setselectedAddressData = (data, details) => {
    this.setState({
      viewMap: true,
      selectedAddressData: data,
      selectedAddressDetail: details,
    })
  };

  render() {
    const { navigation } = this.props;

    return (
      <Block flex center style={styles.container}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.navigate('Location')}>
          <Icon size={16} name="arrowleft" family="AntDesign" style={styles.backIconStyle} />
        </TouchableOpacity>
        <GooglePlacesAutocomplete
          placeholder='street address, city, state'
          minLength={2} // minimum length of text to search
          autoFocus={true}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
          listViewDisplayed='false'    // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            this.setselectedAddressData(data, details);
          }}
      
          getDefaultValue={() => ''}

          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyBIr-qC1OKhBK0SMELrKImcXNQjxXqHgZI',
            language: 'en', // language of the results
            types: '(cities)' // default: 'geocode'
          }}

          styles={{
            textInputContainer: {
              width: '100%'
            },
            description: {
              fontWeight: 'bold',
              color: 'white',
            },
            predefinedPlacesDescription: {
              color: '#1faadb'
            },
          }}

          // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          // currentLocationLabel="Current location"
          nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }}
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            type: 'cafe'
          }}

          GooglePlacesDetailsQuery={{
            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
            fields: 'formatted_address',
          }}

          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          // predefinedPlaces={[homePlace, workPlace]}
          textInputProps={{ onFocus: () => this.setState({viewMap: false}) }}

          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          // renderLeftButton={() => <Icon size={16} name="arrow-long-left" family="Entypo" style={{ color: 'white' }} />}
          // renderRightButton={() => <Text>Search</Text>}
        />
        {this.state.selectedAddressData && this.state.viewMap == true ?
          <MapView
            style={styles.mapStyle}
            showsUserLocation={false}
            zoomEnabled={true}
            zoomControlEnabled={true}
            toolbarEnabled = {true}
            mapType='satellite'
            region={{
              latitude: this.state.selectedAddressDetail.geometry.location.lat,
              longitude: this.state.selectedAddressDetail.geometry.location.lng,
              latitudeDelta: 0,
              longitudeDelta: 0,
            }}
          >

            <Marker
              coordinate={{ latitude: this.state.selectedAddressDetail.geometry.location.lat, longitude: this.state.selectedAddressDetail.geometry.location.lng }}
              title={this.state.selectedAddressData.description}
              description={"This is my address"}
            />
          </MapView>
          :
          <Block/>
        }
        <Button
          shadowless
          style={styles.selectButton}
          color={materialTheme.COLORS.BUTTON_COLOR}
          onPress={() => navigation.navigate('Location', {fixedAddressName: this.state.selectedAddressData.description, fixedAddressLatitude: this.state.selectedAddressDetail.geometry.location.lat, fixedAddressLongitude: this.state.selectedAddressDetail.geometry.location.lng})}>
          SELECT
        </Button>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: theme.COLORS.BLACK,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 2 : theme.SIZES.BASE,
  },
  backIcon: {
    alignSelf: 'flex-start',
    width: 16,
    height: 16,
    marginLeft: 17,
    marginTop: 25,
    marginBottom: 15,
  },
  backIconStyle: {
    color: 'white'
  },
  mapStyle: {
    // marginTop: 10,
    marginBottom: 70,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 210,
  },
  selectButton: {
    position: 'absolute',
    bottom: 15,
    backgroundColor: '#666666',
  }

});
