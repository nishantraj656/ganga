import React from 'react';
import {StyleSheet,Text,View,ScrollView,Image,TouchableOpacity,Platform } from 'react-native';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions,createAppContainer } from 'react-navigation';


export const RestaurantScreenStack = createStackNavigator(
    {
      HomeScreen: {
        screen: RestaurantScreen,
        navigationOptions: ({ navigation }) => ({
          headerTitle: HeaderTitle,
          headerStyle: {
            backgroundColor: '#2874f0'
          },
          headerLeft: <MenuButton obj={navigation}  />,
        }),
      }
    },
    {
      
    }
  );