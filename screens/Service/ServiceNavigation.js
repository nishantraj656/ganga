import React from 'react';
import { Button, Text, View,Modal,Dimensions,TouchableOpacity} from 'react-native';
import { Container, Header, Content, Spinner } from 'native-base';
import { createStackNavigator, createBottomTabNavigator,createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';

import CategoryScreen from './Home/CategoryScreen';
import HistoryListScreen from './History/HistoryListScreen';
import HistoryDetailsScreen from './History/HistoryDeatilsScreen';
import SubCategoryScreen from './Home/SubCategoryScreen';
import ServiceManProfileScreen from './Home/ServiceManProfileScreen';
import HireMeScreen from './Home/HireMeScreen';
import ServiceManListScreen from './Home/ServiceManListScreen';
import Home from './Home';
import MenuButton from '../../components/MenuButton';

// const {width,height} = Dimensions.get('window');

// const HeaderTitle = (<Text style={{color:"#fff",padding: 10, marginLeft:5, fontSize: 20 , fontWeight:"900",fontSize:20}}>SirG2</Text>);
// const TitleSubCat = (<Text style={{color:"#fff",padding: 10, marginLeft:5, fontSize: 20 , fontWeight:"900",fontSize:20}}>SirG2</Text>);
class HeaderTitle extends React.Component{
    render(){
        return(
                <Text style={{
                        color:"#fff",
                        padding: 10, 
                        marginLeft:5, 
                        fontSize: 20 , 
                        fontWeight:"900",
                        fontSize:20
                    }}>{this.props.title}
                </Text>
            )
    }
}
// class MenuButton extends React.Component{
// 	render(){
// 		return(
// 			<View style={{backgroundColor:"#2874f0"}}>
// 				<TouchableOpacity onPress={() => { this.props.obj.toggleDrawer() } }>
//                     {/* <Icon name="menu" style={{color: 'white', padding: 10, marginLeft:5, fontSize: 35}}/> */}
//                     <Icon name="align-left" style={{color: 'white', padding: 10, marginLeft:5, fontSize: 35}}/>
// 				</TouchableOpacity>
// 			</View>
// 		);
// 	}
// }

const HomeStack = createStackNavigator(
    {
        HomeScreen:{
            screen:CategoryScreen,
            navigationOptions: ({ navigation }) => ({
                headerTitle: <HeaderTitle title="Service Manager"/>,
                headerStyle: {
                    backgroundColor: '#2874f0'
                },
                headerLeft: <MenuButton obj={navigation}  />,
            }),
            
            
        } ,
        SubCategoryScreen: {
            screen:SubCategoryScreen,
            navigationOptions: ({ navigation }) => ({
                headerTitle: <HeaderTitle title="Sub Category"/>,
                headerStyle: {
                    backgroundColor: '#2874f0'
                },
            }),
        },
        ServiceManListScreen: {
            screen:ServiceManListScreen,
            navigationOptions: ({ navigation }) => ({
                headerTitle: <HeaderTitle title="Choose Your service Man"/>,
                headerStyle: {
                    backgroundColor: '#2874f0'
                },
            }),
        },
        ServiceManProfileScreen: {
            screen:ServiceManProfileScreen,
            navigationOptions: ({ navigation }) => ({
                headerTitle: <HeaderTitle title="Profile Info"/>,
                headerStyle: {
                    backgroundColor: '#2874f0'
                },
            }),
        },
        HireMeScreen: {
            screen: HireMeScreen,
            navigationOptions: ({ navigation }) => ({
                headerTitle: <HeaderTitle title="Hire Me"/>,
                headerStyle: {
                    backgroundColor: '#2874f0'
                },
            }),
        } ,
        BackTOHome: {
            screen:CategoryScreen,
            navigationOptions: ({ navigation }) => ({
                header: null
            }),
        }
    },
);


// // history stack
// const HistoryDetailsStack = createStackNavigator(
//     {
//         HistoryDetailsScreen: {
//             screen:HistoryDetailsScreen,
//             navigationOptions: ({ navigation }) => ({
//                 headerTitle: <HeaderTitle title="History Details"/>,
//                 headerStyle: {
//                     backgroundColor: '#2874f0'
//                 },
//             }),
//         }
//     },
// );

const HistoryStack = createStackNavigator(
    {
        HistoryListScreen:{
            screen:HistoryListScreen,
            navigationOptions: ({ navigation }) => ({
                headerTitle: <HeaderTitle title="History"/>,
                headerStyle: {
                    backgroundColor: '#2874f0'
                },
            }),
        } ,
        // HistoryDetailsStack: {
        //     screen:HistoryDetailsStack,
        //     navigationOptions: ({ navigation }) => ({
        //         header: null
        //     }), 
        // }
        HistoryDetailsScreen: {
            screen:HistoryDetailsScreen,
            navigationOptions: ({ navigation }) => ({
                headerTitle: <HeaderTitle title="History Details"/>,
                headerStyle: {
                    backgroundColor: '#2874f0'
                },
            }),
        }

    },
);


// HomeScreen: {
//     screen: Home,
//     navigationOptions: ({ navigation }) => ({
//       headerTitle: null,
//       headerStyle: {
//         backgroundColor: '#2874f0'
//       },
        // headerLeft: <MenuButton obj={navigation}  />,
//     }),
//   },



const ServiceTab = createBottomTabNavigator(
    {
        // Home:HireMeStack,
        HomeStack,
        HistoryStack,
        // History:HistoryDetailsStack,

    },
    {
        defaultNavigationOptions  : ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let iconName='worker';
            if(routeName == 'HomeStack'){
                iconName =`home${focused?'':''}`;
            } else if (routeName === 'HistoryStack') {
                iconName = `repeat${focused ? '' : ''}`;
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


export default createAppContainer(ServiceTab);
// # 1111114d

