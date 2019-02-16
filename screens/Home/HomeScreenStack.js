import React from 'react';
import {StyleSheet,Text,View,ScrollView,Image,TouchableOpacity,Platform } from 'react-native';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions,createAppContainer } from 'react-navigation';
import HomeScreen from '../HomeScreen';
import GroceryNavigation from '../Grocery/GroceryNavigation';
import HeaderTitle from '../../components/HeaderTitle';
import MenuButton from '../../components/MenuButton';
import CartButton from '../../components/CartButton';

export default createStackNavigator(
    {
      HomeScreen: {
        screen: HomeScreen,
        navigationOptions: ({ navigation }) => ({
          headerTitle: HeaderTitle,
          headerStyle: {
            backgroundColor: '#2874f0'
          },
          headerLeft: <MenuButton obj={navigation}  />,
          headerRight: <CartButton obj={navigation} value="10"  />,
          
        }),
      },
      Grocery: {
        screen: GroceryNavigation,
        navigationOptions: ({ navigation }) => ({
          header:null
        }),
      },
     
     
    },
    {
     initialRouteName:'HomeScreen' 
    }
  );
  
  