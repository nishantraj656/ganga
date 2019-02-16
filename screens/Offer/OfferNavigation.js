import React, { Component } from "react";

import {createStackNavigator } from 'react-navigation';

import MenuButton from "../../components/MenuButton";
import HeaderTitle from "../../components/HeaderTitle";
import OfferList from "./OfferList";
import OfferDetails from "./OfferDetails";
import CartNavigation from "../Cart/CartNavigation";
import CartButton from "../../components/CartButton";
export default createStackNavigator(
    {
      OfferList: {
        screen: OfferList,
        navigationOptions: ({ navigation }) => ({
          headerTitle: HeaderTitle,
          headerStyle: {
            backgroundColor: '#2874f0'
          },
          headerLeft: <MenuButton obj={navigation}  />,
          headerRight: <CartButton obj={navigation} value="10"  />,
          
        }),
      },
      OfferDetails:{
          screen:OfferDetails
      },
      cart:{
          screen:CartNavigation
      }
    },
    {
      
    }
  );