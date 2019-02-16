import React, { Component } from "react";
import {
    StyleSheet,
    WebView ,
    View,
    TouchableOpacity,
    Dimensions,
    AsyncStorage,
    ToastAndroid,
    NetInfo,
    Modal,
} from "react-native";
import { 
    Container,
    Spinner,
    Button,
    Text,
    Content,
    Header,
    Left,
    Right,
    Title,
    Body,
    Input,
    Card,
    CardItem,
    List,
    ListItem,
    Form,
    Picker,
    Item,
    Textarea,
    Label,
    Thumbnail,
} from 'native-base';
import Icon  from 'react-native-vector-icons/Feather';
import Category from "./Category";
import ItemList from "./ItemList";
import MenuButton from "../../components/MenuButton";
import HeaderTitle from "../../components/HeaderTitle";
import Details from "./Details";
import CartNavigation from "../Cart/CartNavigation";
import CartButton from "../../components/CartButton";
import ShoppingPage from  "./ShopList";
import ShopCategory from './ShopCategory';
const {width,height} = Dimensions.get('window');
import {createDrawerNavigator,DrawerItems,createAppContainer, SafeAreaView,createStackNavigator,NavigationActions,createBottomTabNavigator } from 'react-navigation';
import ShopDetail from './shopDetails';
import ShopsProductsList from './ShopProductList';
import ShopProductDetails from './ShopProductDetails';

const StackNav =  createStackNavigator(
    {
      category: {
        screen: Category,
        navigationOptions: ({ navigation }) => ({
          headerTitle: HeaderTitle,
          headerStyle: {
            backgroundColor: '#2874f0'
          },
          headerLeft: <MenuButton obj={navigation}  />,
          headerRight: <CartButton obj={navigation} value="10"  />,
        }),
      },
      ItemDetails:{
          screen: Details,
          navigationOptions: ({ navigation }) => ({
            headerTitle:"Item Details",
           headerStyle: {
             backgroundColor: '#2874f0'
           },
         }),
      },
      itemList:{
          screen:ItemList,
          navigationOptions: ({ navigation }) => ({
            headerTitle:"Item Details",
           headerStyle: {
             backgroundColor: '#2874f0'
           },
         }),
      }
    },
    {
      
    }
);



class ShoppingScreen1 extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}

const ShoppingScreen =  createStackNavigator(
  {
    ShopList: {
      screen: ShoppingPage,
      navigationOptions: ({ navigation }) => ({
        headerTitle: "Shop List",
        headerStyle: {
          backgroundColor: '#2874f0'
        },
        headerLeft: <MenuButton obj={navigation}  />,
        headerRight: <CartButton obj={navigation} value="10"  />,
      }),
    },
    CategoryList:{
        screen: ShopCategory,
        navigationOptions: ({ navigation }) => ({
          headerTitle:"Catrgory",
         headerStyle: {
           backgroundColor: '#2874f0'
         },
       }),
    },
    ShopDetail:{
        screen:ShopDetail,
        navigationOptions: ({ navigation }) => ({
          headerTitle:"Details",
         headerStyle: {
           backgroundColor: '#2874f0'
         },
       }),
    },
    ShopsProductsList:{
      screen: ShopsProductsList,
      navigationOptions: ({ navigation }) => ({
        headerTitle:"Prodoct List",
       headerStyle: {
         backgroundColor: '#2874f0'
       },
     }),
    },
    ShopProductDetails:{
        screen:ShopProductDetails,
        navigationOptions: ({ navigation }) => ({
          headerTitle:"Details",
        headerStyle: {
          backgroundColor: '#2874f0'
        },
      }),
    }
  },
  {
    
  }
);

 

const TabNavigator = createBottomTabNavigator(
  {
      HomeStack: StackNav,
      Shopping: ShoppingScreen,
      Cart: CartNavigation,
  },
  {
    defaultNavigationOptions  : ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName='worker';
        if(routeName == 'HomeStack'){
            iconName =`home${focused?'':''}`;
        } else if (routeName === 'Shopping') {
            iconName = `lock${focused ? '' : ''}`;
        } else if (routeName === 'Cart') {
            iconName = `shopping-cart${focused ? '' : ''}`;
        }
        return <Icon name={iconName} size={30} color={tintColor} style={{fontWeight:'900'}}/>;
      },
      
    }),
    tabBarOptions: {
        activeTintColor: '#0087e0',
        inactiveTintColor: '#747474',
        style:{backgroundColor: '#fff'},
        showLabel:false,
    },
        
    animationEnabled: false,
    swipeEnabled: true,
    initialRouteName :'HomeStack',

  },
);

export default createAppContainer(TabNavigator);
