import React, { Component } from "react";
import {
    StyleSheet,
    WebView ,
    View,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    AsyncStorage,
    Image,
    TouchableHighlight,
    
    FlatList,
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
    Subtitle,
} from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import { Tile } from "react-native-elements";
import Global from "../../constants/Global";
import { CartRemoveItem, CartPrepare } from "../../constants/OrderListPrepare";
const {width,height} = Dimensions.get('window');

export default class Order extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            LodingModal: false,
            data:[],
            path:'http://gomarket.ourgts.com/public/',
            GroceryShop:[],
            priceTopay:0,
            selectedShop:{Key:''},
            priceData:[]
        }
    }

    componentDidMount() {
         this._start();
        this.setState({path:Global.Image_URL});
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            ()=>{
                console.log("Calling");
                this._start();
            }
        )
     
    }

    componentWillUnmount(){
        this.didFocusListener.remove();
    }

    _store =async(item)=>{
        try {
            await AsyncStorage.setItem('ShopID',JSON.stringify(item.gro_shop_info_id));
           await this.setState({selectedShop:item});
            this.render_price();
           
            console.log(this.state.selectedShop);
        } catch (error) {
            
        }
    }



    _start =async()=>{
     
        data =await AsyncStorage.getItem('CartList');
        data = JSON.parse(data);
     this.setState({data:data});
        await this.render_shop();
    await this.render_price();
      
     await this.setState({renderCoponentFlag: true});
   
    }

    /**Shop List */
    render_shop = async () => {
        let value = await AsyncStorage.getItem('ShopID');
        
        this.setState({selectedShop:value});
        var connectionInfoLocal = '';
        var KEY = await AsyncStorage.getItem('userToken_S');
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
                fetch(Global.API_URL+'Grocery/Shop/List', {
                    method: 'GET',
                    headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                           
                        },
                       
                    }).then((response) => response.json())
                    .then((responseJson) => {
                        var itemsToSet = responseJson.data;
                      // console.log('resp:',itemsToSet);
                        if(responseJson.received == 'yes'){
                        this.setState({GroceryShop:responseJson.data.data}); 
                        this.setState({
                            LodingModal:false,
                        });
                        this.state.GroceryShop.forEach(element=>{
                            if(value == element.gro_shop_info_id){
                               console.log(element);
                                this.setState({selectedShop:element});
                            }
                        })
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
                    this.render_shop();
                });
            }
        });
        console.log(connectionInfoLocal);
    }
   
    
      

     /** fetch price  */
     render_price = async () => {
        let value = await AsyncStorage.getItem('ShopID');
        
        if(value ==null ){
        
           return; 
   
        }
       // this.setState({selectedShop:value});
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
                 fetch(Global.API_URL+'Grocery/Shop/product/price', {
                     method: 'POST',
                     headers: {
                             'Accept': 'application/json',
                             'Content-Type': 'application/json',
                         },
                         body: JSON.stringify({ 
                            id:this.state.data,
                            Shopid: value
                          })
                     }).then((response) => response.json())
                     .then((responseJson) => {
                         var itemsToSet = responseJson.data;
                         console.log('resp in p:',responseJson.data);
                         if(responseJson.received == 'yes'){
                         this.setState({
                             LodingModal:false,
                             priceTopay:responseJson.price,
                             priceData:responseJson.data
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
                     this.render_price();
                 });
             }
         });
         console.log(connectionInfoLocal);
     }

    //  fetchPrice = async() =>{

    //     let value = this.state.selectedShop;
        
    //     if(value ==null ){
            
    //        return; 
   
    //     }
      
    // //   console.log("Pass value for price ",this.state.GrocerySelectedProduct)
        
    //     await  fetch('http://gomarket.ourgts.com/public/api/Grocery/Shop/product/price', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body:JSON.stringify({
    //             id:this.state.data,
    //             Shopid:shop
    //             })
    //         }).then((response) => response.json())
    //             .then((responseJson) => {
                
                
    //           this.setState({avilableItem:responseJson.data});
    //           this.setState({priceTopay:responseJson.price})
              
           
    //         }).catch((error) => {
                    
                
    //             console.log("Erro during Price fetech", error.message);
    //             // log.error({error:err})
    //             //   value.flag=false;
    //             //   value.data = "Network request failed" ==error.message?  console.log("Check internet connection"):error;
    
    //             }); 

    // }

    
_addQuantity=(index) =>{
    const data = this.state.data;
    let array=[];
    data.forEach(element =>{
        if(element.map == index){
            element.Quantity++; 
            CartPrepare(element,element.Quantity++);
        }

        array.push(element);
    })
    this.setState({data:array});
   
    console.log(data)
}

 
_subQuantity=(index) =>{

    const data = this.state.data;
    let array=[];
    data.forEach(element =>{
        if(element.map == index){
           
            CartPrepare(element,element.Quantity > 1? element.Quantity-1 :element.Quantity);
        }

        array.push(element);
    })
    this.setState({data:array});
    
    console.log(data)
  
}

    

    _renderCartItem =({item})=>{
        console.log(item);
        return(
           
            <Card>
                <CardItem>
                <Left><ImageBackground style={{height:100,width:90}} source={{uri:this.state.path+item.pic}}>
                   <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                   <View style={{borderRadius:4,width:20,backgroundColor:'#ffffff',alignSelf:'flex-end',borderWidth:0.1,borderColor:'#000000'}}>
                   <TouchableHighlight onPress={()=>{CartRemoveItem(item);this._start();}}>
                      <Text style={{fontWeight:'900',fontSize:14,alignSelf:'center',color:'#ce0000'}}>X</Text>
                   </TouchableHighlight>
                   </View>
                   <View style={{borderRadius:4,width:20,backgroundColor:'#ffffff',alignSelf:'flex-end',borderWidth:0.1,borderColor:'#000000'}}>
                       <Text style={{alignSelf:'center'}}>{item.Quantity}</Text>
                   </View>
                   </View>
                 </ImageBackground></Left>
                 <Right>
                    <View style={{flexDirection:'row',paddingRight:2,}}>
                          <Title style={{color:'#000000',fontSize:15}}>{item.title}</Title>
                      </View>
                       <View style={{flexDirection:'row',height:30}}>          
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

                 </Right>
                 </CardItem>
            </Card>
            
           );
    }

    _renderShopItem =({item})=>{
       return( 
        <TouchableHighlight onPress={()=>{this._store(item);}}>
            <View style={{borderWidth:0.5}}>
                <View style={{padding:10}}>
                <View style={{alignItems:'center',flexDirection:'row'}}> 
                    <Title style={{color:'#020aed'}}>{item.name}</Title>
                </View>
                <View style={{alignItems:'center',flexDirection:'row'}}> 
                    <Subtitle style={{color:'#7f7f8e'}}> {item.address}</Subtitle>
                </View>
                <View style={{alignItems:'center',flexDirection:'row'}}> 
                    <Subtitle style={{color:'#14012b'}}>Mobile 1: {item.mobile1}</Subtitle>
                </View>
                <View style={{alignItems:'center',flexDirection:'row'}}> 
                    <Subtitle style={{color:'#14012b'}}>Mobile 2: {item.mobile2}</Subtitle>
                </View>

                </View>     
            </View>
        </TouchableHighlight> 
        );
    }

    _renderPrice =({item})=>{
        return( 
            <CardItem >
                <Left>
                <Text style={{color:'#000000',fontSize:15,fontWeight:'700'}}>{item.title} ( {item.Quantity} )</Text>
                </Left>
                <Right>
                <Text style={{color:'#000000',fontSize:15,fontWeight:'700'}}><Icon name="currency-inr" size={15}/>{item.price}</Text>
                </Right>
            </CardItem>
        
            //  <View style={{borderWidth:0.5}}>
            //      <View style={{padding:10}}>
            //      <View style={{alignItems:'center',flexDirection:'row'}}> 
            //          <Title style={{color:'#020aed'}}>{item.title} ( {item.Quantity} )</Title>
            //      </View>
            //      <View style={{alignItems:'center',flexDirection:'row'}}> 
            //          <Subtitle style={{color:'#7f7f8e'}}> {item.address}</Subtitle>
            //      </View>
            //      <View style={{alignItems:'center',flexDirection:'row'}}> 
            //          <Subtitle style={{color:'#14012b'}}>Mobile 1: {item.mobile1}</Subtitle>
            //      </View>
            //      <View style={{alignItems:'center',flexDirection:'row'}}> 
            //          <Subtitle style={{color:'#14012b'}}>Mobile 2: {item.mobile2}</Subtitle>
            //      </View>
 
            //      </View>     
            //  </View>
         
         );
     }

    //  Checkout click
    _checkoutPress =async()=>{
       
            try {
             let token =   await AsyncStorage.getItem('Token');
             let userId = await AsyncStorage.getItem('userID');
             let profile = await AsyncStorage.getItem('userProfileData');
            if(token==null||userId== null || profile == null){
              this.props.navigation.navigate('LoginStack') ;
              setTimeout(() => {this.setState({renderCoponentFlag: false})}, 0);    
            }
            else if(this.state.priceData.length != 0) {
                console.log("Passing to confirm ",JSON.parse(profile))
                
                this.props.navigation.navigate('Conifirm',{selectedShop:this.state.selectedShop,items:this.state.priceData,profile:JSON.parse(profile)});
                setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0); 
            }
            else{
                ToastAndroid.showWithGravity("There is Not any Item",ToastAndroid.LONG,ToastAndroid.BOTTOM)
                this.props.navigation.navigate('Home');
            }
              
            } catch (error) {
                
            }
            
       
    }
    render() {
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container>
                    <Content>
                    
                    <Card >
                            
                        <CardItem style={{backgroundColor:'#221793'}} header>
                            <Title style={{color:'#ffffff'}}>{this.state.selectedShop.name}</Title>
                        </CardItem>
                       
                        <CardItem>
                               <Image style={{height:250,width:width-35,resizeMode:'contain'}} source={{uri:this.state.selectedShop.pic}}/>
                        </CardItem>
                        <CardItem>
                                        <View >
                                <View style={{padding:10}}>
                                <View style={{alignItems:'center',flexDirection:'row'}}> 
                                    <Title style={{color:'#020aed'}}>{this.state.selectedShop.name}</Title>
                                </View>
                                <View style={{alignItems:'center',flexDirection:'row'}}> 
                                    <Subtitle style={{color:'#7f7f8e'}}> {this.state.selectedShop.address}</Subtitle>
                                </View>
                                <View style={{alignItems:'center',flexDirection:'row'}}> 
                                    <Subtitle style={{color:'#14012b'}}>Mobile 1: {this.state.selectedShop.mobile1}</Subtitle>
                                </View>
                                <View style={{alignItems:'center',flexDirection:'row'}}> 
                                    <Subtitle style={{color:'#14012b'}}>Mobile 2: {this.state.selectedShop.mobile2}</Subtitle>
                                </View>

                                </View>     
                            </View>    
                        </CardItem>
                        <CardItem>
                             <Item>
                                 <Title style={{color:'#000000'}}>Total Price :  {this.state.priceTopay} </Title>
                            </Item>     
                        </CardItem>
                       
                   </Card>
                       <Card >
                            
                                <CardItem style={{backgroundColor:'#221793'}} header>
                                    <Title style={{color:'#ffffff'}}> Available Item Into the cart</Title>
                                </CardItem>
                           
                            <CardItem>
                                   
                                       <FlatList
                                       data={this.state.data}
                                       renderItem={this._renderCartItem}
                                       />
                                    
                            </CardItem>
                           
                       </Card>

                       <Card >
                        <CardItem header style={{backgroundColor:'#cccecc'}} >
                            <Title style={{color:'#646b61'}}>PRICE LIST</Title>
                        </CardItem>
                       
                           <FlatList
                            data={this.state.priceData}
                            renderItem={this._renderPrice}
                           />
                        <CardItem footer style={{backgroundColor:'#cccecc'}}>
                            <Left>
                                <Title style={{color:'#035904',fontSize:15,fontWeight:'700'}}>Total Price :</Title>
                            </Left>
                            <Right>
                            <Text style={{color:'#035904',fontSize:15,fontWeight:'700'}}><Icon name="currency-inr" color="#035904" size={15}/>{this.state.priceTopay}</Text>
               
                            </Right>
                            
                        </CardItem>
                    </Card>
                  
                        {/* <Button bordered dark onPress={()=>{
                            this.props.navigation.navigate('ComparePriceStack',{});
                        }}>
                            <Text>Cmpare price stack</Text>
                        </Button> */}
                    <Card >
                        <CardItem header style={{backgroundColor:'#243c9e'}}>
                            <Title>Related Shop</Title>
                        </CardItem>
                       
                           <FlatList
                            data={this.state.GroceryShop}
                            renderItem={this._renderShopItem}
                           />
                        
                    </Card>
                    </Content>
                    <View style={{height:50,backgroundColor:'#d6a22a',flexDirection:'row',justifyContent:'space-around'}}>
                        <Button block onPress={()=>{this._checkoutPress()}} ><Text>Checkout</Text></Button>
                    
                    
                        <Button onPress={()=>{this.props.navigation.navigate('Home');}} block><Text>Continu Shopping</Text></Button>
                    </View>
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