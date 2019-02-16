import React, { Component } from "react";

import {createStackNavigator } from 'react-navigation';

import MenuButton from "../../components/MenuButton";
import HeaderTitle from "../../components/HeaderTitle";
import CartButton from "../../components/CartButton";
import LoginScreen from "./LoginScreen";
import SignUPScreen from "./SingupScreen";
import ForgotScreen from "./ForgotScreen";
export default createStackNavigator(
    {
      LoginScreen: {
        screen: LoginScreen,
        navigationOptions: ({ navigation }) => ({
          header:null
        }),
      },

      SingupScreen:{
        screen:SignUPScreen,
        navigationOptions: ({ navigation }) => ({
          header:null
        }),
      },
      ForgotScreen:{
        screen:ForgotScreen,
        navigationOptions: ({ navigation }) => ({
          header:null
        }),
      }
    },
    {
      initialRouteName :'LoginScreen',
    }
  );


  // navigationOptions: ({ navigation }) => ({
  //   header:null
  // }),