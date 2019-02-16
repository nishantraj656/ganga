import React, { Component } from "react";
import {
    StyleSheet,
    WebView ,
    View,
    Dimensions,
    FlatList,
    AsyncStorage,
    NetInfo,
    Modal,
    ToastAndroid
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
    Thumbnail,
} from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from "../../../constants/Global";

class CategoryList extends Component{
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            LodingModal:false,
            cat_subcat_list:[
                // {
                //   "category": "Travel",
                //   "subcategory": [
                //     {
                //       "key": 1,
                //       "value": "Bolero, Sumos"
                //     },
                //     {
                //       "key": 2,
                //       "value": "E-rikshaw"
                //     }
                //   ]
                // },
                // {
                //   "category": "Repair",
                //   "subcategory": [
                //     {
                //       "key": 3,
                //       "value": "Electronic appliances"
                //     },
                //     {
                //       "key": 4,
                //       "value": "Home wiring & Fitting"
                //     },
                //     {
                //       "key": 5,
                //       "value": "Computer & Laptops"
                //     },
                //     {
                //       "key": 6,
                //       "value": "Furnitures"
                //     },
                //     {
                //       "key": 7,
                //       "value": "Two Wheeler"
                //     },
                //     {
                //       "key": 8,
                //       "value": "Three Wheeler"
                //     },
                //     {
                //       "key": 9,
                //       "value": "Four Wheeler"
                //     }
                //   ]
                // },
                // {
                //   "category": "Software",
                //   "subcategory": [
                //     {
                //       "key": 10,
                //       "value": "Computer Format"
                //     },
                //     {
                //       "key": 11,
                //       "value": "Drivers & Softwares"
                //     },
                //     {
                //       "key": 12,
                //       "value": "Misc Services"
                //     }
                //   ]
                // }
              ],
            serviceManListData:[
                // {
                //   "info_id":"1",
                //   "avtar_url":"https://instagram.fpat1-1.fna.fbcdn.net/vp/84c4e443d47dc2aa70a613a017a4c001/5CBB0AAC/t51.2885-19/s150x150/31908285_2109461939310314_4190149362170462208_n.jpg?_nc_ht=instagram.fpat1-1.fna.fbcdn.net",
                //   "name":"Aarav kumar",
                //   "ratting":"5.0",
                //   "review":"1500",
                //   "rate":"1415"
                // },
                // {
                //   "info_id":"2",
                //   "avtar_url":"https://instagram.fpat1-1.fna.fbcdn.net/vp/836fa6eefe891bacb435221da1a34e9f/5CB68126/t51.2885-19/s150x150/23594988_159717817967684_5705323595526307840_n.jpg?_nc_ht=instagram.fpat1-1.fna.fbcdn.net",
                //   "name":"Sushant Kumar",
                //   "ratting":"1.9",
                //   "review":"640",
                //   "rate":"1100"
                // },
                // {
                //   "info_id":"3",
                //   "avtar_url":"https://instagram.fpat1-1.fna.fbcdn.net/vp/d9dfa225194e9cbd0a0abfed6f754559/5CD8326A/t51.2885-19/s150x150/40845500_267627190434383_2753863881221734400_n.jpg?_nc_ht=instagram.fpat1-1.fna.fbcdn.net",
                //   "name":"Ritika",
                //   "ratting":"4.7",
                //   "review":"1200",
                //   "rate":"1000"
                // },
                // {
                //   "info_id":"4",
                //   "avtar_url":"https://instagram.fpat1-1.fna.fbcdn.net/vp/875eed91e71a0354a970d9bbc5adebbd/5CD73B3E/t51.2885-19/s150x150/47173921_268889120486253_4384497285149491200_n.jpg?_nc_ht=instagram.fpat1-1.fna.fbcdn.net",
                //   "name":"Radhika Garg",
                //   "ratting":"4.3",
                //   "review":"574",
                //   "rate":"918"
                // }
              ],
        }
    }
    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
    }
    // renderCatSubCatData = async () => {
    //     var connectionInfoLocal = '';
    //     var KEY = await AsyncStorage.getItem('userToken_S');
    //     NetInfo.getConnectionInfo().then((connectionInfo) => {
    //         console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    //         // connectionInfo.type = 'none';//force local loding
    //         if(connectionInfo.type == 'none'){
    //             console.log('no internet ');
    //             ToastAndroid.showWithGravityAndOffset(
    //                 'Oops! No Internet Connection',
    //                 ToastAndroid.LONG,
    //                 ToastAndroid.BOTTOM,
    //                 25,
    //                 50,
    //             );
    //             return;
    //         }else{
    //             console.log('yes internet '); 
    //             fetch(Global.API_URL+'cat_sub_cat_US', {
    //                 method: 'POST',
    //                 headers: {
    //                         'Accept': 'application/json',
    //                         'Authorization':'Bearer '+KEY,
    //                 },
    //                 body: JSON.stringify({  })
    //             }).then((response) => response.json())
    //             .then((responseJson) => {
    //                 var itemsToSet = responseJson.data;
    //                 console.log('resp:',itemsToSet);
    //                 this.setState({
    //                     cat_subcat_list:itemsToSet,
    //                     renderCoponentFlag: true
    //                 })
    //         }).catch((error) => {
    //             ToastAndroid.showWithGravityAndOffset(
    //                 'Network Failed!!! Retrying...',
    //                 ToastAndroid.LONG,
    //                 ToastAndroid.BOTTOM,
    //                 25,
    //                 50,
    //             );
    //             console.log('on error featching:'+error);
    //             this.renderCatSubCatData();
    //         });
    //     }
    //     });
    //     console.log(connectionInfoLocal);
    // }
    render_ProfileData = async (info_id) => {
        console.log("in redner profile data:"+info_id);
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
                this.setState({
                    LodingModal:true,
                })
                console.log('yes internet '); 
                console.log("now featchind data:");
                fetch(Global.API_URL+'render_renderProfileData_US', {
                    method: 'POST',
                    headers: {
                            'Accept': 'application/json',
                            'Authorization':'Bearer '+KEY,
                        },
                        body: JSON.stringify({ 
                            profileID:info_id,
                         })
                    }).then((response) => response.json())
                    .then((responseJson) => {
                        var itemsToSet = responseJson.data;
                        console.log('resp get profile:',itemsToSet);
                        if(responseJson.received == 'yes'){
                            console.log("profle dat sucessuly featched:");
                            this.setState({
                                LodingModal:false,
                            })
                            console.log("navginatin fot profile screen:");
                            this.props.navigation.navigate('ServiceManProfileScreen',{
                                ProfileData:itemsToSet,
                            });
                            console.log("sent to prifle screen:");
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
                    this.render_renderProfileData();
                });
            }
        });
        console.log(connectionInfoLocal);
    }
    render(){
        const {renderCoponentFlag} = this.state;
        const ServiceManList = this.props.navigation.getParam('ServiceManList', []);
        
        console.log("serviceman lit ",ServiceManList);        
        if(renderCoponentFlag){
            return(
                <Content>
                        <List dataArray={ServiceManList}
                            renderRow={(item) =>
                            <ListItem thumbnail onPress={()=>{
                                // console.log("category screen button",item);
                                // this.props.navigation.navigate('ServiceManProfileScreen',{
                                //     subcategory:item.subcategory
                                // });
                                this.render_ProfileData(item.info_id)
                            }}>
                                <Left>
                                    <Thumbnail square source={{ uri: item.avtar_url }} />
                                </Left>
                                <Body>
                                    <Text style={{fontSize:18,fontWeight:'500'}}>{item.name}</Text>
                                    <View style={{flexDirection:'row'}} numberOfLines={1}>
                                        <Text style={{
                                                fontWeight:'500',
                                                fontSize:15,
                                                backgroundColor:'#ffa329',
                                                color:'white',
                                                borderRadius:5,
                                                paddingHorizontal:5
                                            }}>
                                                {item.ratting}
                                        </Text>
                                        
                                        <Text style={{
                                            fontWeight:'500',
                                            fontSize:15,
                                            color:'#ffa329',
                                            borderRadius:5,
                                            // paddingHorizontal:5
                                        }}>
                                            {item.ratting >=0.5 ? <Icon name="star" size={20}/> : <Icon name="star-outline" size={20}/>}
                                            {item.ratting >=1.5 ? <Icon name="star" size={20}/> : <Icon name="star-outline" size={20}/>}
                                            {item.ratting >=2.5 ? <Icon name="star" size={20}/> : <Icon name="star-outline" size={20}/>}
                                            {item.ratting >=3.5 ? <Icon name="star" size={20}/> : <Icon name="star-outline" size={20}/>}
                                            {item.ratting >=4.5 ? <Icon name="star" size={20}/> : <Icon name="star-outline" size={20}/>}
                                        </Text>
                                        
                                       
                                        
                                    </View>
                                    <Text style={{fontSize:15,}}>({item.review} reviews)</Text>
                                    <Text style={{color:'#0088e0',fontWeight:'500'}}>₹{item.rate} INR/Work</Text>
                                </Body>
                                <Right>
                                    <Icon name="chevron-right" style={{fontSize:30,color:'#179ae1'}}/>
                                </Right>
                            </ListItem>
                            }>
                        </List>
                        <Modal
                            animationType='slide'
                            transparent={true}
                            visible={this.state.LodingModal}
                            onRequestClose={() => {
                                // this.setState({
                                // LodingModal:false
                            // })
                            }}>
                                <AdvLoder/>
                        </Modal>
                </Content>
            );
        }else{
            return (
                <View style={styles.loder}>
                    <AdvLoder/>
                </View>
            );
        }
    }
}


export default class ServiceManListScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
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
                    <Header style={{backgroundColor:'#fff'}}>
                    <Right style={{borderColor:'#848484',borderRadius:8,borderWidth:1}}>
                        <Icon name='magnify' style={{fontSize:30,alignSelf:'center',paddingHorizontal:5}} />
                        <Input placeholder="Browse" />
                    </Right>
                    </Header>
                    <CategoryList navigation = {this.props.navigation}/>
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
            <View style={{ flex: 1, width:width, justifyContent: 'center', alignItems: 'center',backgroundColor:'#09090999'}}> 
                <Spinner color='#079bff' size='large' style={{height:40}} />
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