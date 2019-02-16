import React, { Component } from "react";

import {createStackNavigator } from 'react-navigation';
import MenuButton from "../../components/MenuButton";
import HeaderTitle from "../../components/HeaderTitle";
import Home from "./Home";
import EditProfile from "./EditProfile";
import RewardNavigation from "../Reward/RewardNavigation";
import ViewProfile from "./ViewProfile";
import MyOrderNavigation from "../MyOrder/MyOrderNavigation";
import CartButton from "../../components/CartButton";
import LoginNavigation from "../Login/LoginNavigation";

export default createStackNavigator(
    {
     
      Home:{
          screen: Home
      },
      EditProfile: {
        screen: EditProfile,
        navigationOptions: ({ navigation }) => ({
          headerTitle: HeaderTitle,
          headerStyle: {
            backgroundColor: '#2874f0'
          },
          headerLeft: <MenuButton obj={navigation}  />,
          headerRight: <CartButton obj={navigation} value="10"  />,
          
        }),
      },
      RewardStack:{
          screen:RewardNavigation
      },
      ViewProfile:{
          screen: ViewProfile
      },
      MyOrderStack:{
          screen:MyOrderNavigation
      },
      Login:{
        screen: LoginNavigation,
        navigationOptions: ({ navigation }) => ({
          header:null
        }),
      },
      
    },
    {
      initialRouteName :'Home',
    }
  );