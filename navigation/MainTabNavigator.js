import React from 'react';
import {StyleSheet,Text,View,ScrollView,Image,TouchableOpacity,Platform } from 'react-native';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions,createAppContainer } from 'react-navigation';

import Icon  from 'react-native-vector-icons/Feather';
import GroceryNavigation from '../screens/Grocery/GroceryNavigation';
import ServiceNavigation from '../screens/Service/ServiceNavigation';
import OfferNavigation from '../screens/Offer/OfferNavigation';
import MyOrderNavigation from '../screens/MyOrder/MyOrderNavigation';
import RewardNavigation from '../screens/Reward/RewardNavigation';
import CartNavigation from '../screens/Cart/CartNavigation';
import MyProfileNavigation from '../screens/MyProfile/MyProfileNavigation';
import HomeScreenStack from '../screens/Home/HomeScreenStack';
import SearchNavigation from '../screens/Search/SearchNavigation';


const CustomDrawerContentComponent = (props) => (
  
	<SafeAreaView style={{flex:1,backgroundColor:'#0962f5'}} forceInset={{ top: 'always', horizontal: 'never' }}>
		<View style={{height:100, backgroundColor:'#0962f5',alignItems:'center',justifyContent:'center'}}>
			{/* <Image source={require('../assets/images/icon.png')} style={{height:120,width:120,borderRadius:60}}/> */}
		</View>
		
		<ScrollView style={{backgroundColor:'#FFF'}}>
			<DrawerItems {...props} />
		</ScrollView>

	</SafeAreaView>
  
);





// const ExampleScreenFirstStack = ({
//     : {
//       screen:ExampleScreenFirst,
//       
//     },
//     : {
//       screen:ExampleScreenSecond,
//     },
// });
// const ExampleScreenSecondStack = createStackNavigator(
//   {
    
//   },
// );


// const ExampleScreenFirstStack = createStackNavigator({
  
// });



const AppDrawerNavigator = createDrawerNavigator({
  
	Home:{
		screen:HomeScreenStack,
		navigationOptions: {
			drawerIcon: ({ tintColor }) => (<Icon name="home" size={24} style={{ color: tintColor }} />),
		}
  },

  Grocery:{
		screen:GroceryNavigation,
		navigationOptions: {
			drawerIcon: ({ tintColor }) => (<Icon name="truck" size={24} style={{ color: tintColor }} />),
		}
  },
  // Restaurant:{
	// 	screen:ResturantNavigation,
	// 	navigationOptions: {
	// 		drawerIcon: ({ tintColor }) => (<Icon name="home-outline" size={24} style={{ color: tintColor }} />),
	// 	}
  // },
//   Services:{
// 		screen:ServiceNavigation,
// 		navigationOptions: {
// 			drawerIcon: ({ tintColor }) => (<Icon name="phone-call" size={24} style={{ color: tintColor }} />),
// 		}
//   },
  OfferZone:{
		screen:OfferNavigation,
		navigationOptions: {
			drawerIcon: ({ tintColor }) => (<Icon name="tag" size={24} style={{ color: tintColor }} />),
		}
  },
  MyOrders:{
		screen:MyOrderNavigation,
		navigationOptions: {
			drawerIcon: ({ tintColor }) => (<Icon name="shopping-bag" size={24} style={{ color: tintColor }} />),
		}
  },
//   MyRewards:{
// 		screen: RewardNavigation,
// 		navigationOptions: {
// 			drawerIcon: ({ tintColor }) => (<Icon name="gift" size={24} style={{ color: tintColor }} />),
// 		}
//   },
  MyCart:{
		screen:CartNavigation,
		navigationOptions: {
			drawerIcon: ({ tintColor }) => (<Icon name="shopping-cart" size={24} style={{ color: tintColor }} />),
		}
  },
  MyAccount:{
		screen:MyProfileNavigation,
		navigationOptions: {
			drawerIcon: ({ tintColor }) => (<Icon name="user" size={24} style={{ color: tintColor }} />),
		}
  },
  Search:{
		screen:SearchNavigation,
		navigationOptions: {
			drawerIcon: ({ tintColor }) => (<Icon name="search" size={24} style={{ color: tintColor }} />),
		}
	},
	
},{
  contentComponent:CustomDrawerContentComponent,
  initialRouteName :'Home',
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const AppContainer = createAppContainer(AppDrawerNavigator);

// Now AppContainer is the main component for React to render

export default AppContainer;