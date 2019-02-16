import React, { Component } from "react";
import {
  StyleSheet,
  WebView ,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  AsyncStorage,
  ToastAndroid,
  FlatList,
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
  Row,
  Subtitle,
  
} from 'native-base';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import DeckSwiperAdvancedExample from "./ImageExample";
import Global from "../constants/Global";
import { CartPrepare } from "../constants/OrderListPrepare";
const {width,height} = Dimensions.get('window');

export default class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      renderCoponentFlag: false,
      LodingModal: false,
      DataRecent:[],
      data:[{key:'1',title:'Gorcery',navigationKey:'Grocery',pic:'https://upload.wikimedia.org/wikipedia/commons/1/13/Supermarkt.jpg'}]
    }
  }
 
  componentDidMount() {
    this.render_Frequently()
    setTimeout(() => {this.setState({renderCoponentFlag: true})}, 5);
  }

 
  render_Frequently = async () => {

    let profile = await AsyncStorage.getItem('userProfileData');
    if(profile==null){
      console.log("Profile na he bhi ");
        return
    }
    profile = JSON.parse(profile);
    console.log("My user ID ",profile);
    var connectionInfoLocal = '';
    var KEY = await AsyncStorage.getItem('Token');
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
      // connectionInfo.type = 'none';//force local loding
      if(connectionInfo.type == 'none'){
        console.log('no internet ');
        ToastAndroid.showWithGravityAndOffset(
          'Oops! No Internet Connection',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
        return;
      }else{
        console.log('yes internet '); 
        this.setState({
          LodingModal:true,
        });
        fetch(Global.API_URL+'Recent', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization':'Bearer '+KEY,
            },
            body: JSON.stringify({ 
              userID:profile.user_id
             })
          }).then((response) => response.json())
          .then((responseJson) => {
           var itemsToSet = responseJson.data;
           // console.log('resp:',itemsToSet);
            if(responseJson.received == 'yes'){
            this.setState({
              LodingModal:false,DataRecent:itemsToSet
            });
            }else{
              ToastAndroid.showWithGravityAndOffset(
                'Internal Server Error',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
            }
        }).catch((error) => {
          ToastAndroid.showWithGravityAndOffset(
            'Network Failed!!! Retrying...',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
          console.log('on error fetching:'+error);
          this.render_Frequently();
        });
      }
    });
    console.log(connectionInfoLocal);
  }

  _renderItem = ({item}) =>{
                            return(
                             <TouchableOpacity onPress={()=>{this.props.navigation.navigate(item.navigationKey)}}>
                             <View  style={{justifyContent:'center',width:60,paddingHorizontal:10,paddingVertical:4,borderColor:"#040504"}}>
                                  <Image style={{height:50,width:50,resizeMode: 'contain'}} source={{uri: item.pic}}/>
                                  <Text style={{color:'#000000',fontSize:10}}>{item.title}</Text>   
                              </View>
                              </TouchableOpacity>
                              
                            )
                           } 
  
    _renderRecent = ({item}) =>{
      
      let pName = item.title;
     
     
      return(
       
              
        
        <View style={{ flex:1,
                        backgroundColor:'#fcfcfc', 
                        padding:5,
                        width:150,
                        height:250, 
                        borderWidth:0.5,
                        borderColor:'#cecece',
                        borderRadius:1
                        }}>

           
             <View style={{width:100, height: 150,borderRadius:5}}>
           
                <Image style={{width:100, height: 150,borderRadius:5,resizeMode: 'contain',}} source={{uri:Global.Image_URL+item.pic}}/>
            </View>

            <View style={{flex:1,paddingLeft:1}}>

          
             <View style={{alignItems:'center', justifyContent:'center',padding:3}}>
                <Text style={{fontSize:14,fontWeight:'300'}}>{pName} </Text>
            </View> 
            </View>
            
            <View style={{padding:3}}>
            {
              item.flag ?
              <Button bordered onPress={()=>{this._addItem(item.map)}}>
                <Text>Add to Cart</Text>
              </Button>
              :
              <View style={{flexDirection:'row'}}>
                 <Button style={{height:30,width:25,alignItems:'center'}}  onPress={()=>{this._subQuantity(item.map); /**this.setState({item:{Quantity:qunt}})*/}}>
                                        <Text style={{color:'#ffffff',textAlign:'center',alignSelf:'center', fontSize:'900',fontSize:15}}>-</Text>
                                    </Button>
                                    <View style={{borderWidth:1,width:50,alignItems:'center'}}>
                                        <Title style={{color:'#000000'}}>{item.Quantity}</Title>
                                    </View>                        
                                    <Button style={{height:30,width:25,alignItems:'center'}}  onPress={()=>{this._addQuantity(item.map); /** this.setState({item:{Quantity:qunt}})*/}}>
                                      <Text style={{color:'#ffffff',textAlign:'center',alignSelf:'center', fontSize:'900',fontSize:15}}>+</Text>
                                     </Button>   
              </View>
            }
            </View>
       
    </View>
    
    
      )
    }

       
_addQuantity=(index) =>{
  
  let array=[];
  this.state.DataRecent.forEach(element =>{
      if(element.map == index){
        console.log(element);
          element.Quantity++; 
          CartPrepare(element,element.Quantity);
      }

      array.push(element);
  })
  this.setState({DataRecent:array});
 
  console.log("In add quintity");
}


_subQuantity=(index) =>{

  
  let array=[];
  this.state.DataRecent.forEach(element =>{ 
    
      if(element.map == index){
        console.log(element);
          CartPrepare(element,element.Quantity > 1? --element.Quantity :element.Quantity);
      }

      array.push(element);
  })
  this.setState({DataRecent:array});
  
  console.log("In sub qantity")

}

_addItem =(id)=>{

  let tempArray =[];
  this.state.DataRecent.forEach(element=>{
      
      if(element.map == id){
          element.flag = false;
          console.log(element);
      }
      tempArray.push(element);      
  })

  this.setState({DataRecent:tempArray});
  console.log("In add Item");
}



  render() {
    const {renderCoponentFlag} = this.state;
    if(renderCoponentFlag){
      return(
        <Container>
          <Content>
            <Card style={{height:100,width:500}} transparent >
              <FlatList
                data={this.state.data}
               
               
                renderItem={this._renderItem}
                horizontal
              />
            </Card>
            <Card style={{height:150}}>
              
                <DeckSwiperAdvancedExample/>
             
            </Card>
            {
              this.state.DataRecent.length != 0?
              <Card>
                <CardItem header>
                    <Subtitle style={{color:'#202123'}}>Recent Buy Product</Subtitle>
                </CardItem>
                  <FlatList
                  data={this.state.DataRecent}
                  renderItem={this._renderRecent}
                  horizontal
                  />
              </Card>
              :<View></View>
            }


            <Button bordered dark onPress={()=>{
              this.props.navigation.navigate('Gorcery');
            }}>
              <Text> Go to Profile screen</Text>
            </Button>
          </Content>
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