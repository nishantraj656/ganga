import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    NetInfo,
    Image,
    View,
    Text,
    ToastAndroid,
    FlatList,
    ScrollView,
    Modal,
    TouchableHighlight,
    Alert,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Thumbnail,ListItem,Container,List,Grid,Picker,Item,
     Header, Content, Spinner,Button,Label,Input, Title,Card,CardItem,Left,Body,Right,Subtitle, Form } from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Global from '../../constants/Global';
import { Avatar } from 'react-native-elements';

const {width,height} = Dimensions.get('window');


function sendNotification(title,msg,token){
    
   
    // console.log("Tokn :",token);
    fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            
            "content-type": "application/json",
        },
        body:JSON.stringify( {
            to:token,
            sound: "default",
            body: msg,
            title:title,
            badge: 1,
          })
        })
        console.log("Notification send");
    }

  

export default class ConifirmOrder extends React.Component {
    constructor(props){
        super(props);
        this.state={
            renderCoponentFlag:false,
            LodingModal: false,
            data:[],
           price :'',
           offerPrice:'',
           topay:'',
            selectedShop:[],
            selectedProduct:[],
            profile:[],
            name:'',
            userID:'',
            phone:'',
            street:'',
            state:'',
            city:'',
            pincode:''
           
        }
    }
    
    componentDidMount = async () => {
    
        this.setState({path:Global.Image_URL});
        this._getData();
    }



    _getData =async()=>{
        const { navigation } = this.props;
        const item = navigation.getParam('items',null);
        const shop =navigation.getParam('selectedShop',null);
        const profile = navigation.getParam('profile',null);
        
        if(shop == null || item == null || profile == null){
            ToastAndroid.showWithGravity("Select Any shop For Shoping",ToastAndroid.LONG,ToastAndroid.BOTTOM);
            this.props.navigation.navigate('Auth');
        }
      await this.setState({data:item,selectedShop:shop,userID:profile.user_id,name:profile.cname,pincode:profile.cpin,renderCoponentFlag:true});
     
       this._calculation();
    }

    _validation = ()=>{
        let flag = true;
        console.log(this.state.phone.toString().length);
        if(this.state.name.length==0)
        {
            ToastAndroid.showWithGravity("Please Enter Your Name",ToastAndroid.LONG,ToastAndroid.BOTTOM);
            return  flag = false;
        }
        else if(this.state.phone.toString().length != 10 )
        {
            ToastAndroid.showWithGravity("Please ! Enter Correct Phone Number",ToastAndroid.LONG,ToastAndroid.BOTTOM);
           return flag = false;
        }
        else if(this.state.pincode.toString().length != 6)
        {
            ToastAndroid.showWithGravity("Please Enter Your Pincode",ToastAndroid.LONG,ToastAndroid.BOTTOM);
           return flag = false;
        }
        return flag;
    }

    render_OrderSend = async () => {
       if(!this._validation()){
            return
       }
        const data =  JSON.stringify({
            Order:this.state.data,
            shop:this.state.selectedShop.gro_shop_info_id,
            address:"Name : "+this.state.profile.cname+" Phone : +91 "+this.state.phone+" Address :"+this.state.street+" , State : Bihar ,City : Bhagalpur , Picode "+this.state.profile.cpin,
            realPrice:this.state.price,
            cid:this.state.userID,
            topay:this.state.topay,
            offer:this.state.offerPrice
          })

         // console.log(data);
        var connectionInfoLocal = '';
        var KEY = await AsyncStorage.getItem('Token');
        if(KEY == null ){
            ToastAndroid.showWithGravityAndOffset(
                'Oops! Somthing Wrong Retry',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM
            );
        }
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
                fetch(Global.API_URL+'gro_order', {
                    method: 'POST',
                    headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization':'Bearer '+KEY,
                        },
                        body:data
                    }).then((response) => response.json())
                    .then((responseJson) => {
                        var itemsToSet = responseJson.data;
                        console.log('resp:',responseJson);
                        if(responseJson.received == 'yes'){

                        let title="Ther is new Order From "+this.state.cname;
                        let msg = "Price"+this.state.topay;
                        let token = this.state.selectedShop.noti_token;
                        sendNotification(title,msg,token);   
                        this._reset(); 
                                                

                        this.setState({
                            LodingModal:false,
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
                    this.render_OrderSend();
                });
            }
        });
        console.log(connectionInfoLocal);
    }

    _reset=async()=>{
        await AsyncStorage.setItem('CartList',JSON.stringify([]));
        this.props.navigation.navigate('Auth');
    }

    _calculation=()=>{
        
        let price=0;
        let topay =0;

        this.state.data.forEach(element=>{
            console.log("Obj ",element.price);
            price +=element.price*element.Quantity;
            topay += element.price*element.Quantity - (element.offer*element.price*element.Quantity/100)
        })
        let offer = price - topay;
        this.setState({price:price,topay:topay,offerPrice:offer});
    }
   

    render() {
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container>
                    <Content>
                        <View style={{flex:1}}>
                            <View style={{flex:4,backgroundColor:'#2873f0',height:height*(0.15)}}>
                                <View style={{alignSelf:'center',alignContent:'center',alignItems:'center',marginVertical:10}}>
                                    <Avatar 
                                        onPress={()=>{alert("Change Image")}}
                                        size='large'
                                        source={{
                                            uri:'https://instagram.fpat1-1.fna.fbcdn.net/vp/dce4af24219a91eddff731d00cae9ed7/5CE9B8C6/t51.2885-19/s150x150/17933956_832093003610694_4703758160064675840_a.jpg?_nc_ht=instagram.fpat1-1.fna.fbcdn.net',
                                        }}
                                        showEditButton
                                        rounded
                                        title="MD"
                                    />
                                </View>
                            </View>
                           
                            <View style={{flex:6,backgroundColor:'#fff'}}>
                               
                                
                                
                                <Card>
                                    <CardItem>
                                        <Item floatingLabel>
                                            <Label style={{color:'#2873f0'}}>Name (+91)</Label>
                                            <Input underlineColorAndroid="#2873f0" 
                                            onChangeText={(text)=>{this.setState({name:text})}}
                                            value={this.state.name}/>
                                        </Item>
                                    </CardItem>
                                    <CardItem>
                                        <Item floatingLabel>
                                            <Label style={{color:'#2873f0'}}>Phone NO</Label>
                                            <Input underlineColorAndroid="#2873f0" 
                                            onChangeText={(text)=>{this.setState({phone:text+''});}}
                                            value={this.state.phone}
                                            keyboardType='numeric'
                                            />
                                        </Item>
                                    </CardItem>
                                
                                </Card>
                                
                                <Card>
                                    <CardItem header>
                                        <Text>Shipping Address</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Body>
                                            <CardItem>
                                                <Item floatingLabel>
                                                    <Label style={{color:'#2873f0'}}>State</Label>
                                                    <Input 
                                                        underlineColorAndroid="#2873f0" 
                                                        value="Bihar" 
                                                        editable={false} />
                                                </Item>
                                            </CardItem>
                                            <CardItem>
                                                <Item floatingLabel>
                                                    <Label style={{color:'#2873f0'}}>City</Label>
                                                        <Input 
                                                            underlineColorAndroid="#2873f0" 
                                                            value="Bhagalpur" 
                                                            editable={false} />
                                                </Item>
                                            </CardItem>
                                            <CardItem>
                                                <Item floatingLabel>
                                                    <Label style={{color:'#2873f0'}}>Street</Label>
                                                    <Input 
                                                        underlineColorAndroid="#2873f0" 
                                                        onChangeText={(text)=>{this.setState({street:text})}}
                                                        value={this.state.street}
                                                        />
                                                </Item>
                                            </CardItem>
                                            <CardItem>
                                                <Item floatingLabel>
                                                    <Label style={{color:'#2873f0'}}>Pincode</Label>
                                                    <Input 
                                                        underlineColorAndroid="#2873f0"
                                                        onChangeText={(text)=>{this.setState({pincode:text+''})}}
                                                        value={""+this.state.pincode}
                                                        keyboardType='numeric' />
                                                </Item>
                                            </CardItem>
                                            
                                            
                                            
                                            
                                        </Body>
                                    </CardItem>
                                        <Button transparent block onPress={()=>{this.render_OrderSend();}}>
                                            <Text style={{fontSize:15,fontWeight:'500',color:'#2873f0'}}>SUBMIT</Text>
                                        </Button>
                                </Card>
                                
                            </View>
                        </View>
                    </Content>
                </Container>
            );
        }else{
            return (
            <Loading/>
            );
        }
    }
}

class Loading extends React.Component{
    constructor(props){
        super(props)
        this.state={
            width: Dimensions.get('window').width,
            price:0
        }
    }
    render() {
        return (
          <Container>
            <Content>
              <Spinner color='red' />             
            </Content>
          </Container>
        );
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