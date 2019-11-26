import React from 'react';
import { StyleSheet, Dimensions, View, ScrollView } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import MapView from 'react-native-maps';

import { Icon, Product } from '../components';

const { width } = Dimensions.get('screen');

class Location extends React.Component {
  state = {
    selectedTab: 'fixed',
  };

  constructor(props) {
    super(props);
  };

  setSelectedTab = (value) => {
    this.setState({ selectedTab: value })
  }
  saveData = () => {
    alert("Your data has saved successfully!");
  }

  renderSearch = () => {
    const { navigation } = this.props;
    const iconCamera = <Icon size={16} color={theme.COLORS.MUTED} name="zoom-in" family="material" />

    return (
      <Input
        right
        color="black"
        style={styles.search}
        iconContent={iconCamera}
        placeholder="street address, city, state"
        onFocus={() => navigation.navigate('Pro')}
      />
    )
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

  renderContents = () => {
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
      <Block flex center style={styles.location}>
        <Text style={styles.locationType}>Location Type</Text>
        {this.renderTabs()}
        {this.renderSearch()}
        {this.renderContents()}
        {this.renderSave()}
      </Block>

    );
  }
}

export default Location;


const styles = StyleSheet.create({
  location: {
    width: width,
  },
  locationType: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 20,
  },
  search: {
    height: 48,
    width: width - 40,
    marginHorizontal: 16,
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
    // position: 'absolute',
    bottom: 0,
    marginTop: 5,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 305,
  },
  saveButton: {
    position: 'absolute',
    bottom: 15,
    backgroundColor: '#666666',
  }
});
