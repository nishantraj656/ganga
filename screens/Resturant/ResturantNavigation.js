import React, { Component } from "react";

import {createStackNavigator } from 'react-navigation';
import ViewProfile from "../MyProfile/ViewProfile";
import CartButton from "../../components/CartButton";


export default createStackNavigator(
  {
    HomeScreen: {
      screen: ViewProfile,
      navigationOptions: ({ navigation }) => ({
        headerTitle: HeaderTitle,
        headerStyle: {
          backgroundColor: '#2874f0'
        },
        headerLeft: <MenuButton obj={navigation}  />,
        headerRight: <CartButton obj={navigation} value="10"  />,
        
      }),
    }
  },
  {
    
  }
);