import React from 'react';
import { Easing, Animated } from 'react-native';
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';

import OnboardingScreen from '../screens/Onboarding';
import LocationScreen from '../screens/Location';
import SearchScreen from '../screens/Search';

import Menu from './Menu';
import Header from '../components/Header';
import { Drawer } from '../components/';

const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index
    const width = layout.initWidth
    
    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    })
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1],
    })
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0],
    })

    const scaleWithOpacity = { opacity }
    const screenName = "Search"

    if (screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] }
  }
})

const LocationStack = createStackNavigator({
  Location: {
    screen: LocationScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header search white title="Location" navigation={navigation} />,
    })
  },
},
{
  cardStyle: { 
    backgroundColor: '#EEEEEE',
  },
  transitionConfig,
});

const AppStack = createDrawerNavigator(
  {
    Onboarding: {
      screen: OnboardingScreen,
      navigationOptions: {
        drawerLabel: () => {},
      },
    },
    Location: {
      screen: LocationStack,
      navigationOptions: {
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Location" title="Location" />
        )
      },
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        drawerLabel: () => {},
      },
    },
  },
  Menu
);

const AppContainer = createAppContainer(AppStack);
export default AppContainer;