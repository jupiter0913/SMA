import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, StatusBar, Dimensions, Platform } from 'react-native';
import { Block, Button, Text, theme, Input } from 'galio-framework';
import MapView from 'react-native-maps';
import Icon from '../components/Icon';
import { materialTheme } from '../constants';

const { height, width } = Dimensions.get('screen');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);


export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: '',
      searchAddress: '',
    };
  };

  onChangeAddressText = (text) => {
    this.setState({ selectedAddress: '', searchAddress: text });
  };

  setSelectedAddress = (value) => {
    this.setState({
      selectedAddress: value,
      searchAddress: value,
    })
  };

  renderItem = ({ item }) => {
    return (
      <Block flex>
        <TouchableOpacity onPress={() => this.setSelectedAddress(item.title)}>
          <Block row style={{ paddingTop: 7 }}>
            <Icon name="marker" family="Foundation" style={styles.searchText} />
            <Text size={14} style={styles.searchText}>{item.title}</Text>
          </Block>
        </TouchableOpacity>
      </Block>
    );
  }

  render() {
    const { navigation } = this.props;
    const payment = [
      { title: "Manage Payment Options", id: "payment" },
      { title: "Manage Gift Cards", id: "gift" },
    ];

    return (
      <Block flex center style={styles.container}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.navigate('Location')}>
          <Icon size={32} name="arrow-long-left" family="Entypo" style={{ color: 'white' }} />
        </TouchableOpacity>
        <Input
          right
          color="black"
          style={styles.search}
          placeholder="street address, city, state"
          value={this.state.searchAddress}
          onChangeText={(text) => this.onChangeAddressText(text)}
        />
        {this.state.selectedAddress ?
          <MapView style={styles.mapStyle}
            provider='google'
            mapType='satellite'
          >
          </MapView> :
          <FlatList
            data={payment}
            keyExtractor={(item, index) => item.id}
            style={{ alignSelf: 'flex-start' }}
            renderItem={this.renderItem}
          />
        }
        <Button
          shadowless
          style={styles.selectButton}
          color={materialTheme.COLORS.BUTTON_COLOR}
          onPress={() => navigation.navigate('Location')}>
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
    width: 32,
    height: 32,
    marginLeft: 20,
  },
  search: {
    height: 48,
    width: width - 40,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  searchText: {
    color: theme.COLORS.WHITE,
    paddingLeft: 20,
  },
  mapStyle: {
    marginTop: 10,
    marginBottom: 10,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 210,
  },
  selectButton: {
    position: 'absolute',
    bottom: 15,
    backgroundColor: '#666666',
  }

});
