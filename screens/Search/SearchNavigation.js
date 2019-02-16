import React, { Component } from "react";

import {createStackNavigator } from 'react-navigation';

import MenuButton from "../../components/MenuButton";
import HeaderTitle from "../../components/HeaderTitle";
import CartButton from "../../components/CartButton";
import HomeScreen from "./HomeScreen";
export default  createStackNavigator(
    {
      HomeScreenSearch: {
        screen: HomeScreen,
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