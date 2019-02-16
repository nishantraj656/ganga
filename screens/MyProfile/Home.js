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
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions, } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
const {width,height} = Dimensions.get('window');

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            LodingModal: false,
        }
    }
   
    componentDidMount() {
        this.Auth();
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            ()=>{
                console.log("Calling");
                this.Auth();
            }
        )
    }

  componentWillUnmount(){
      this.didFocusListener.remove();
  }

    LogOut=async()=>{
            try{
                await AsyncStorage.removeItem('Token');
                await AsyncStorage.removeItem('userID');
                await AsyncStorage.removeItem('userProfileData');
       
          this.Auth();  
           
        } catch (error) {
            
        }
        
    }

    Auth=async()=>{
        try {
            let token =   await AsyncStorage.getItem('Token');
            let userId = await AsyncStorage.getItem('userID');
            let profile = await AsyncStorage.getItem('userProfileData');
            if(token==null||userId== null || profile == null){
                this.props.navigation.navigate('Login') ;
                //   setTimeout(() => {this.setState({renderCoponentFlag: false})}, 0);    
            }
            else
                setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);    
        } catch (error) {
            
        }
        
    }

    render() {
       
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container>
        <Header>
          <Left/>
          <Body>
          <Title>My Account</Title>
          </Body>
          <Right />
        </Header>
        <Content>
        <Card>
            <CardItem header bordered>
            <Left>
                <Text>My Orders</Text>
            </Left>
            
            </CardItem>
            
            <CardItem footer>
            <Right>
                <Button hasText transparent onPress={()=>{this.state.obj.navigate('BillList');}}>
                <Text>VIEW ALL ORDERS</Text>
                </Button>
            </Right>
            </CardItem>
         </Card>
        {/* Address */}
         <Card>
            <CardItem header bordered>
            <Left>
                <Text>My Addresses</Text>
                <Text style={{color:'#cdd0d6', fontSize:13,}}>{this.state.address}, {this.state.city}, {this.state.state}, {this.state.pincode}</Text>
        
            </Left>
            <Body>
                   </Body>
            
            </CardItem>
            
            <CardItem footer>
            <Right>
                <Button hasText transparent onPress={()=>{this.state.obj.navigate('Address');}}>
                <Text>VIEW MORE</Text>
                </Button>
            </Right>
            </CardItem>
         </Card>

         <Card>
            <CardItem header bordered>
            <Left>
                <Text>GANGA CART Plus Zone</Text>
            </Left>
            
            </CardItem>
            
            <CardItem footer>
            <Right>
                <Button hasText transparent onPress={()=>{alert("Order Click")}}>
                <Text>VIEW ALL ORDERS</Text>
                </Button>
            </Right>
            </CardItem>
         </Card>
        </Content>
        
          
          <Card>
            <CardItem bordered>
            <Button hasText transparent onPress={()=>{this.LogOut()}}>
                <Text>LogOut</Text>
                </Button>
            
            </CardItem>
            
           
         </Card>
         
        
      </Container>
            );
        }else{
            return (
                
            <AdvLoder/>
            );
        }
    }
}


class AdvLoder extends Component{
    render(){
        const {width,height} = Dimensions.get('window');
        return(
            <View style={{ flex: 1, width:width, justifyContent: 'center', alignItems: 'center',backgroundColor:'#fff'}}> 
                <Spinner color='#2874f0' size='large' style={{height:40}} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    loder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});