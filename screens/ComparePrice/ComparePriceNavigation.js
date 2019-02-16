import React, { Component } from "react";

import {createStackNavigator } from 'react-navigation';
import MenuButton from "../../components/MenuButton";
import HeaderTitle from "../../components/HeaderTitle";
import ItemDetails from "./ItemDetails";
import ItemList from "./ItemList";
import Order from "../Cart/Order";
import ConifirmOrder from "../Cart/ConifirmOrder";
// import CartNavigation from "../Cart/CartNavigation";
import CartButton from "../../components/CartButton";




export default createStackNavigator(
    {
      // CartNavigation:{
      //   screen:CartNavigation  Also Included due o parent
      // },
      ItemDetails: {
        screen: ItemDetails,
        navigationOptions: ({ navigation }) => ({
          headerTitle: HeaderTitle,
          headerStyle: {
            backgroundColor: '#2874f0'
          },
          headerLeft: <MenuButton obj={navigation}  />,
          headerRight: <CartButton obj={navigation} value="10"  />,
          
        }),
      },
      ItemList:{
          screen: ItemList                                                                                                                  
      },
      
    },
    {
      
    }
  );

