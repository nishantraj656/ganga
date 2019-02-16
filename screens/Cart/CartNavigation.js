import React from "react";
import {AsyncStorage,Dimensions} from 'react-native';
import {createStackNavigator } from 'react-navigation';

import MenuButton from "../../components/MenuButton";
import HeaderTitle from "../../components/HeaderTitle";
import Order from "./Order";
import ConifirmOrder from "./ConifirmOrder";
import ComparePriceNavigation from "../ComparePrice/ComparePriceNavigation";
import CartButton from "../../components/CartButton";
import LoginNavigation from "../Login/LoginNavigation";
import { Container, Content, Item,Title,Subtitle, View,Text, Button } from "native-base";

  class MyAuthScreen extends React.Component{
    constructor(props){
      super(props);
      this.state={
        isItem:false
      }
    }

   async componentDidMount (){
      try {
        this.setState({isItem:false})
        let a = await AsyncStorage.getItem('CartList');
        a = JSON.parse(a);
        if(a.length != 0){
          this.setState({isItem:true})
        }
      } catch (error) {
        
      }
      this.didFocusListener = this.props.navigation.addListener(
        'didFocus',
        ()=>{
            console.log("Calling flag :",this.state.isItem);
            this.componentDidMount();
        }
    )
    }

    componentWillUnmount(){
      this.didFocusListener.remove();
  }

    render(){
      if(!this.state.isItem){
        return(
          <Container>
            <Content >
             <View style={{alignItems:"center",marginTop:Dimensions.get('screen').height/3,padding: 5,}}>
              <View style={{padding: 5}}>
                <Title style={{color:'#000000'}}>Your Cart is empty!</Title>
              </View>
              <View style={{padding: 5}}>
                <Subtitle style={{color:'#8e8e86'}}>Add item to it now</Subtitle>

              </View>
              <View style={{padding: 5}}>
              <Button onPress={()=>{this.props.navigation.navigate('Home');}}>
                  <Text>Shop Now</Text>
              </Button>
              </View>
              </View>
            </Content>
          </Container>
        )
      }
      else
       return this.props.navigation.navigate('OrderScreen')
    }


  }



  export default createStackNavigator(
    {
      Auth:{
        screen:MyAuthScreen,
        navigationOptions: ({ navigation }) => ({
          headerTitle: HeaderTitle,
          headerStyle: {
            backgroundColor: '#2874f0'
          },
          headerLeft: <MenuButton obj={navigation}  />,
          headerRight: <CartButton obj={navigation} value="10"  />,
          
        })
      },
      OrderScreen: {
        screen: Order,
        navigationOptions: ({ navigation }) => ({
          headerTitle: HeaderTitle,
          headerStyle: {
            backgroundColor: '#2874f0'
          },
          headerLeft: <MenuButton obj={navigation}  />,
          headerRight: <CartButton obj={navigation} value="10"  />,
          
        }),
      },
      Conifirm:{
          screen:ConifirmOrder,
          navigationOptions:({navigation})=>({
            header:null
          })
      },
      ComparePriceStack:{
          screen:ComparePriceNavigation
      },

     
      LoginStack:{
        screen:LoginNavigation,
        navigationOptions:({header:null})
      },
       

    },
    {
      initialRouteName:"Auth"
    }
  );