import React, { Component } from "react";
import {
    StyleSheet,
    WebView ,
    View,
    TouchableOpacity,
    Dimensions,
    AsyncStorage,
    ActivityIndicator,
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
} from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
const {width,height} = Dimensions.get('window');
import Feedback from './feedback';

export default class OrderDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            LodingModal: false,
            data:[],
            isEmpty:'Wait List is Loading .......',
            price:'',
            cartID:'',
            token:'',
            status:'',
            ratting:'',
            feedback:'',
        }
    }
    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
        this._start();
    }

    _start = async () => {

        const {navigation} = this.props;
        let cart = navigation.getParam('cart_id',0);
        let status = navigation.getParam('status',0);
        let ratting = navigation.getParam('ratting',0);
        let feedback = navigation.getParam('feedback',0);
        let token = await AsyncStorage.getItem('Token');
        if(cart == null && token == null){
            console.log("Cart ID is null.");
            return;
        }
        this.setState({
            cartID:cart,
            token:token,
            status:status,
            ratting:ratting,
            feedback:feedback,
        });
        console.log('fire Called');
        await this.fire();
    }

    fire = async() =>{

        var connectionInfoLocal = '';
            NetInfo.getConnectionInfo().then((connectionInfo) => {
            console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
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
                
                fetch('http://gomarket.ourgts.com/public/api/Retailer/getOrderItem', {
                    method: 'POST',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type': 'application/json',
                        'Authorization':'Bearer '+this.state.token,
                    },
                    body: JSON.stringify({
                        'id':this.state.cartID,
                    })
                }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    if(Object.keys(responseJson.data).length == 0){
                        this.setState({isEmpty:"List is empty..."});
                    }
                    else{
                        var temp = 0;
                        for (const item of responseJson.data) {
                            temp += (item.real_price - item.offer_price)*item.gro_quantity;
                        }
                        this.setState({price:temp});
                        this.setState({data:responseJson.data});
                    } 
                    }).catch((error) => {
                        console.log("on error featching:"+error);
                });
            }
            });
            this.setState({refreshing:false});
            console.log(connectionInfoLocal);

        // await  fetch('http://gomarket.ourgts.com/public/api/Grocery/Order/History/Item', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Authorization':'Bearer '+this.state.token
        //     },
        //     body:JSON.stringify({
        //         cartID:this.state.cartID
        //         })
        //     }).then((response) => response.json())
        //         .then(async(responseJson) => {
                    
        //              this.setState({data:responseJson.data.data,isEmpty:"List is Empty....."});             
        //             console.log("Load History.........",responseJson);
        //             let pr=0
        //             for(var j =0;responseJson.data.data.length >j;j++)
        //             pr += responseJson.data.data[j].real_price * responseJson.data.data[j].gro_quantity
        //             this.setState({price:pr});
        //     }).catch(async(error) => {      
        //        console.log(error);        
        // });    
    }

    _renderIteam=({item})=>{
        return(
            <View style={{padding:3,flexDirection:'row',borderBottomColor:'black',borderBottomWidth:1}}>
                <View style={{alignItems:'flex-start',padding:3,width:'20%',margin:5,}} >
                    <Text style={{fontSize:15,fontWeight:'900'}}><Icon name={'currency-inr'} size={15}/>{(item.real_price - item.offer_price)*item.gro_quantity}</Text>
                </View>
                <View style={{alignItems:'flex-start',width:'50%',padding:3,margin:5,}}>
                    <Text style={{fontSize:15,fontWeight:'900'}}>{item.gro_product_name} ({item.gro_quantity})</Text>
                </View>
                <View style={{alignItems:'flex-start',width:'25%',padding:3,margin:5,}}>
                    <Text style={{fontSize:15,fontWeight:'900'}}><Icon name={'currency-inr'} size={15}/>{item.real_price} / {(item.quantity == 1) ? '' : item.quantity}{item.unit_name}</Text>
                </View>
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
                                <View style={{padding:3,flexDirection:'row'}}>
                                    <View style={{alignItems:'flex-start',padding:3,width:'20%',margin:5,}} >
                                        <Text style={{fontSize:15,fontWeight:'900'}}>Amount</Text>
                                    </View>
                                    <View style={{alignItems:'flex-start',width:'50%',padding:3,margin:5,}}>
                                        <Text style={{fontSize:15,fontWeight:'900'}}>Name</Text>
                                    </View>
                                    <View style={{alignItems:'flex-start',width:'25%',padding:3,margin:5,}}>
                                        <Text style={{fontSize:15,fontWeight:'900'}}>Price</Text>
                                    </View>
                                </View>
                            </CardItem>
                        </Card>
                        <List>
                            <FlatList
                                data={this.state.data} 
                                renderItem={this._renderIteam}
                                numColumns={1} 
                                keyExtractor={item => item.order_id} 
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
                            <View style={{padding:3,flexDirection:'row'}}>
                                <View style={{alignItems:'flex-start',padding:3,width:'30%',margin:5}} >
                                    <Text style={{fontSize:20,fontWeight:'900'}}><Icon name={'currency-inr'} size={20}/>{this.state.price}</Text>
                                </View>
                                <View style={{alignItems:'flex-start',width:'60%',padding:3,margin:5,}}>
                                    <Text style={{fontSize:20,fontWeight:'900'}}>Total Amount</Text>
                                </View>
                            </View>

                            <ListItem>
                                <Body>
                                    <Text style={{fontSize:15,fontWeight:'900'}}>Order Status  : {this.state.status == 1 ? "packed" : this.state.status == 0 ? "Waiting" : "Delivered"}</Text>
                                </Body>
                            </ListItem>
                        </List>
                        <Feedback feedback = {this.state.feedback} ratting = {this.state.ratting} />
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