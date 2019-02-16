import React, { Component } from "react";
import {
    StyleSheet,
    WebView ,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    AsyncStorage,
    ToastAndroid,
    NetInfo,
    Modal,
    FlatList
} from "react-native";
import { 
    Container,
    Spinner,
    Button,
    Text,
    Content,
    Header,
    tab,
    Tabs,
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
    Tab,
} from 'native-base';
import {createMaterialTopTabNavigator } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
const {width,height} = Dimensions.get('window');
 
export default class Current extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            LodingModal: false,
            data:[],
            data1:[],
            datap:[],  
            userID:0,
            process:false,
            isEmpty:'Wait List is Loading.....',
            token:'',
            price:0,
            profile:{}
        }
    }
    componentDidMount() {
        this._retrieveData();
    }

    _retrieveData = async () => {
        try {
            let token =   await AsyncStorage.getItem('Token');
            let userId = await AsyncStorage.getItem('userID');
            let profile = await AsyncStorage.getItem('userProfileData');
           if(token==null||userId== null || profile == null){
             this.props.navigation.navigate('Login') ;
             setTimeout(() => {this.setState({renderCoponentFlag: false})}, 0);    
           }
           else{
                profile = JSON.parse(profile);        
                this.setState({userID:userId,token:token,profile:profile})
                this.fetchOrder();
                setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
           } 

        } catch (error) {
           // Error retrieving data
           console.log("Error he re baba :: ",error);
        }
    }

      /** call for order */
    fetchOrder = async()=>{
        
        var connectionInfoLocal = '';
        NetInfo.getConnectionInfo().then((connectionInfo) => {
     //   console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
        if(connectionInfo.type == 'none'){
            console.log("no internet ");
            ToastAndroid.showWithGravityAndOffset(
            'Oops! No Internet Connection',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
            );        
        }else{
            console.log("yes internet ");
            this.setState({renderCoponentFlag:false});
            fetch('http://gomarket.ourgts.com/public/api/Grocery/Order/History', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer '+this.state.token
                },
                body:JSON.stringify({
                    userID:this.state.profile.customer_info_id
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson); 
                if(Object.keys(responseJson.data.data).length > 0){
                    
                    let arrayh = [];
                    let arrayc = [];
                    this.setState({data:responseJson.data.data,isEmpty:"List is Empty....."});
                    let pr=0
                    for (const data of responseJson.data.data) {
                        pr += data.paid_amt;
                        console.log(parseInt(data.status) > 1)
                        if(parseInt(data.status) > 1){
                            arrayh.push(data);
                        }
                        else{
                            arrayc.push(data);
                        }
                    }
                    this.setState({
                        price:pr,
                        data:arrayc,
                        data1:arrayh,
                        isEmpty:"No Record Found"
                    });
                }
                }).catch((error) => {
                    console.log("on error featching:"+error);
            });
        }
        });
        console.log(connectionInfoLocal); 
    }


    _storeData = async (item) => {
        try {
                //console.log(select)
                await AsyncStorage.setItem('cartID',JSON.stringify(item.gro_cart_id));
                this.props.navigation.navigate("OrderDetails",{
                    cart_id:item.gro_cart_id,
                    status:item.status,
                    ratting:item.rating,
                    feedback:item.feedback,
                });
            } catch (error) {
                // Error saving data
                console.log("Error in store data beta ",error);
            }
      }

    _renderIteamList=({item})=>{
        var date = String(item.created_at).split(' ');
        var days = String(date[0]).split('-');
        var hours = String(date[1]).split(':');
        var ds = days[2]+"/"+days[1]+"/"+days[0]+"  "+date[1];
 
        return(
             <View style={{shadowOpacity:5,shadowColor:"#050505"}}>
             <TouchableOpacity onPress={()=>{ this._storeData(item);}}>
                 <View style={{  flex:1,
                         backgroundColor:(item.real_amt-item.offer_amt) != item.paid_amt? (item.real_amt-item.offer_amt)!=(item.real_amt-item.offer_amt)-item.paid_amt? '#e59587':'#e04f35':'#ffffff', 
                         padding:5,
                         width:"100%", 
                         height:120, 
                         borderRadius:5,
                         borderWidth:1,
                     }}>
                      
                     <View style={{alignItems:'center',justifyContent:'center',padding:3,flexDirection:'row',justifyContent:'space-around'}}>
                     <Text style={{fontSize:17,fontWeight:'900'}}>{item.name}</Text>
                         <Text style={{fontSize:12,fontWeight:'900'}}>Order ID :{item.gro_cart_id}</Text>
                         
                     </View>
 
                     <View style={{justifyContent:'space-around',flexDirection:'row'}}>
                    
                     <View>
                     <Text style={{fontSize:25,fontWeight:'900'}}> {item.real_amt-item.offer_amt} </Text>
                    
                     <Text style={{fontSize:20,fontWeight:'900'}}>Total Price</Text>
                    
                     </View>

                     <View>
                    {item.status==0? 
                        <Text style={{color:'#bfed07',fontSize:20,fontWeight:'900'}}>Wait...</Text>
                        :
                        (item.status == 1) ?
                            <Icon name={"cart"} style={{color:'green'}} size={20}/>
                        :
                        <Icon name={"cart-off"} style={{color:'red'}} size={20}/>
                     } 
                     </View>

                     <View>
                     <Text style={{fontSize:25,fontWeight:'900'}}>{(item.real_amt-item.offer_amt)-item.paid_amt}</Text>
                      <Text style={{fontSize:20,fontWeight:'900'}}>Dues  </Text>
                    
                      </View>
                     </View>
                     <View style={{alignItems:'center',justifyContent:'center',padding:1,flexDirection:'row'}}>
                         <Text style={{fontSize:12}}>Date - {ds}</Text>
                     </View>
                </View>
            </TouchableOpacity>                      
            </View>                                   
        );
    }  


    render() {
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container>
                    <Content>
                        <Card>  
                            <CardItem>
                                <Body>
                                    <Text>Total Paided Amount :</Text>
                                </Body>
                                <Right>
                                    <Text><Icon name={'currency-inr'} size={15}/> {this.state.price}</Text>
                                </Right>
                            </CardItem>
                        </Card>
                        <Card>
                            <CardItem>
                                <Text style = {{fontWeight:'700',fontSize:20,color:'green'}}>Order In Process</Text>
                            </CardItem>
                        </Card>
                        <FlatList
                            data={this.state.data}
                            renderItem={this._renderIteamList}
                            keyExtractor = {(item)=>{item.gro_cart_id}}
                            ListEmptyComponent={()=>{
                                if(this.state.isEmpty =='Wait List is Loading.....')
                                    return(<View style={{justifyContent:'center'}}>
                                        <ActivityIndicator size="large" color="#0000ff" />
                                        <Text>{this.state.isEmpty}</Text>

                                    </View>);
                                else
                                return(<View style={{justifyContent:'center'}}>
                                        <Text>{this.state.isEmpty}</Text>

                                        </View>)}}
                        />  
                        <Card>
                            <CardItem>
                                <Text style = {{fontWeight:'700',fontSize:20,color:'red'}}>Order History</Text>
                            </CardItem>
                        </Card>
                        <FlatList
                            data={this.state.data1}
                            renderItem={this._renderIteamList}
                            keyExtractor = {(item)=>{item.gro_cart_id}}
                            ListEmptyComponent={()=>{
                                if(this.state.isEmpty =='Wait List is Loading.....')
                                    return(<View style={{justifyContent:'center'}}>
                                        <ActivityIndicator size="large" color="#0000ff" />
                                        <Text>{this.state.isEmpty}</Text>

                                    </View>);
                                else
                                return(<View style={{justifyContent:'center'}}>
                                        <Text>{this.state.isEmpty}</Text>

                                        </View>)}}
                        /> 
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


class History extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            LodingModal: false,
        }
    }
    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
    }

    render() {
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container>
                    <Content>
                        <Button bordered dark onPress = {() => this.props.navigation.navigate('OrderDetails')}>
                            <Text>History</Text>
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

const Home = createMaterialTopTabNavigator(
    {
        Order:{screen:Current},
        History:{screen:History},
        },
        {
            tabBarOptions:{
                activeTintColor: 'tomato',
                inactiveTintColor: '#ffffff',
                style:{backgroundColor: '#2f304c'},
            },
            animationEnabled: true,
            swipeEnabled: true,
            initialRouteName :'Order',
        },   
);

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