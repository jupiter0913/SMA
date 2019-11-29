import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Dimensions, View, ScrollView } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import MapView, { Marker } from 'react-native-maps';

import { Icon, Product } from '../components';

const { width } = Dimensions.get('screen');
const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };

class Location extends React.Component {
  state = {
    selectedTab: 'fixed', // value is 'fixed' or 'mobile'.
    index: 0,
  };

  constructor(props) {
    super(props);
  };

  searchInputItems = [];

  setSelectedTab = (value) => {
    this.setState({ selectedTab: value })
  }

  addInputText = () => {
    var num = this.state.index;
    let newSearchInputItem = {
      property: num,
    }
    num++;
    this.setState({ index: num });
    this.searchInputItems.push(newSearchInputItem);

  }

  saveData = () => {
    alert("Your data has saved successfully!");
  }

  renderTabs = () => {
    return (
      <Block row style={styles.tabs}>
        <Button shadowless style={[styles.tab, styles.divider, { backgroundColor: this.state.selectedTab == 'fixed' ? '#666666' : '#999999' }]} onPress={() => this.setSelectedTab('fixed')}>
          <Block row middle>
            <Text size={16} style={styles.tabTitle}>fixed</Text>
          </Block>
        </Button>
        <Button shadowless style={[styles.tab, { backgroundColor: this.state.selectedTab == 'mobile' ? '#666666' : '#999999' }]} onPress={() => this.setSelectedTab('mobile')}>
          <Block row middle>
            <Text size={16} style={styles.tabTitle}>mobile</Text>
          </Block>
        </Button>
      </Block>
    )
  }

  renderFixed = () => {
    const { navigation } = this.props;
  
    return (
      <Block>
        <Input
          right
          color="black"
          style={styles.search}
          placeholder="street address, city, state"
          onFocus={() => navigation.navigate('Search')}
        />
        <MapView
          style={styles.mapStyle}
          showsUserLocation={false}
          zoomEnabled={true}
          zoomControlEnabled={true}
          // mapType='satellite'
          initialRegion={{
            latitude: 34.0522342,
            longitude: -118.2436849,
            latitudeDelta: 0,
            longitudeDelta: 0,
          }}>

          <Marker
            coordinate={{ latitude: 34.0522342, longitude: -118.2436849 }}
            title={"Los Angeles"}
            description={"This is my address"}
          />
        </MapView>
      </Block>
    )
  }

  renderMobile = () => {
    const { navigation } = this.props;
   
    return (
      <Block>
        {this.searchInputItems.map((key) => {
          return (
            <Input
              right
              color="black"
              style={styles.search}
              key={key.property}
              placeholder="street address, city, state"
              onFocus={() => navigation.navigate('Search')}
            />
          );
        })}
      </Block>
    )
  }

  renderMobileSearch = () => {
    const { navigation } = this.props;
   
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="street address, city, state"
        onFocus={() => navigation.navigate('Search')}
      />
    )
  }

  renderMobileContents = () => {
    return (
      <MapView style={styles.mapStyle}
        provider='google'
        mapType='satellite'
      >
      </MapView>
    )
  }

  renderSave = () => {
    return (
      <Button style={styles.saveButton} onPress={() => this.saveData()}><Text>save</Text></Button>
    )
  }

  render() {
    return (
      <Block flex center style={styles.container}>
        <Text style={styles.locationType}>Location Type</Text>
        {this.renderTabs()}
        {this.state.selectedTab == 'fixed' ? this.renderFixed() : this.renderMobile()}
        {this.state.selectedTab == 'fixed' ?
          <Block />
          :
          <TouchableOpacity style={styles.addButton} onPress={() => this.addInputText()}>
            <Icon size={50} name="plus" family="AntDesign" style={{ color: 'white' }} />
          </TouchableOpacity>
        }

        {this.renderSave()}
      </Block>

    );
  }
}

export default Location;

const styles = StyleSheet.create({
  container: {
    width: width,
  },
  locationType: {
    alignSelf: 'flex-start',
    fontSize: 10,
    marginTop: 10,
    marginLeft: 20,
  },
  search: {
    height: 48,
    width: width - 40,
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 3,
  },
  tabs: {
    marginBottom: 5,
    marginTop: 10,
  },
  tab: {
    backgroundColor: '#666666',
    width: (width - 40) / 2,
    borderRadius: 0,
    borderWidth: 0,
    height: 32,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300',
    color: 'white'
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  mapStyle: {
    bottom: 0,
    marginTop: 5,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 305,
  },
  saveButton: {
    position: 'absolute',
    bottom: 15,
    backgroundColor: '#666666',
  },
  addButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 50,
    height: 50,
    borderRadius: 25,
    bottom: 75,
    right: 20,
    backgroundColor: '#333333',
  },
});
