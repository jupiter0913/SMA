import React from 'react';
import { AsyncStorage, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import MapView, { Marker } from 'react-native-maps';
import Header from '../components/Header';
import { Icon } from '../components';

const { width } = Dimensions.get('screen');
const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };

class Location extends React.Component {
  state = {
    selectedTab: 'fixed', // value is 'fixed' or 'mobile'.
    fixedAddressData: [{ address: 'Los Angeles, CA, USA', latitude: '34.0522342', longitude: '-118.2436849', }],
    mobileAddressData: [{
      index: 0,
      address: '',
      latitude: '',
      longitude: '',
    }],
  };

  constructor(props) {
    super(props);

  };

  componentWillReceiveProps(nextProps) {
    if (this.state.selectedTab == "fixed") {
      var address = nextProps.navigation.getParam('address');
      var latitude = nextProps.navigation.getParam('latitude');
      var longitude = nextProps.navigation.getParam('longitude');
      this.setState({
        fixedAddressData: [{ address: address, latitude: latitude, longitude: longitude }]
      })
    } else {
      var selectedIndex = nextProps.navigation.getParam('selectedIndex');
      var address = nextProps.navigation.getParam('address');
      var latitude = nextProps.navigation.getParam('latitude');
      var longitude = nextProps.navigation.getParam('longitude');
      this.setState({
        mobileAddressData: [
          ...this.state.mobileAddressData.slice(0, selectedIndex),
          Object.assign({}, this.state.mobileAddressData[selectedIndex], { address: address, latitude: latitude, longitude: longitude }),
          ...this.state.mobileAddressData.slice(selectedIndex + 1)
        ]
      })
    }
    this.setState(nextProps);
  }

  componentDidMount() {
    setTimeout(async () => {
      // fixed method
      var fixedString = await AsyncStorage.getItem('fixedAddressData');
      if (fixedString != null) {
        object = JSON.parse(fixedString);
        array = Object.keys(object).map(function (k) {
          return object[k];
        });
        this.setState({
          fixedAddressData: array
        })
      }
      // mobile method
      var mobileString = await AsyncStorage.getItem('mobileAddressData');
      if (mobileString != null) {
        object = JSON.parse(mobileString);
        array = Object.keys(object).map(function (k) {
          return object[k];
        });

        this.setState({
          mobileAddressData: array
        })
      }
    }, 100)
  }

  setSelectedTab = (value) => {
    this.setState({ selectedTab: value })
  }

  addInputText = () => {
    var num = this.state.mobileAddressData.length;
    let newSearchInputItem = {
      index: num,
      address: '',
      latitude: '',
      longitude: '',
    }
    num++;
    this.setState({ index: num });
    this.state.mobileAddressData.push(newSearchInputItem);

  }

  saveData = async () => {
    if (this.state.selectedTab == 'fixed') {
      AsyncStorage.setItem('fixedAddressData', JSON.stringify(this.state.fixedAddressData));
      alert("Your fixed data has been saved successfully!");
    } else {
      AsyncStorage.setItem('mobileAddressData', JSON.stringify(this.state.mobileAddressData));
      alert("Your mobile data has been saved successfully!");
    }
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
          onFocus={() => navigation.navigate('Search', { selectedIndex: -1 })}
          value={this.state.fixedAddressData[0].address}
        />
        <MapView
          style={styles.mapStyle}
          showsUserLocation={false}
          zoomEnabled={true}
          zoomControlEnabled={true}
          mapType='satellite'
          region={{
            latitude: parseFloat(this.state.fixedAddressData[0].latitude),
            longitude: parseFloat(this.state.fixedAddressData[0].longitude),
            latitudeDelta: 0,
            longitudeDelta: 0,
          }}
        >
          <Marker
            coordinate={{ latitude: parseFloat(this.state.fixedAddressData[0].latitude), longitude: parseFloat(this.state.fixedAddressData[0].longitude) }}
            title={this.state.fixedAddressData[0].address}
            description={this.state.fixedAddressData[0].address}
          />
        </MapView>
      </Block>
    )
  }

  renderMobile = () => {
    const { navigation } = this.props;

    return (
      <ScrollView>
        {this.state.mobileAddressData.map((key) => {
          return (
            <Input
              right
              color="black"
              style={styles.search}
              key={key.index}
              placeholder="street address, city, state"
              onFocus={() => navigation.navigate('Search', { selectedIndex: key.index })}
              value={this.state.mobileAddressData[key.index].address}
            />
          );
        })}
      </ScrollView>
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
        <Header search white title="Location" />
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
