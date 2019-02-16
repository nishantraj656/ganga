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
    Thumbnail
} from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from "../../../constants/Global";

const {width,height} = Dimensions.get('window');

export default class HistoryListScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            LodingModal: true,
            serviceHistListData:[
                // {
                //     'workerAvtar':'https://i.imgur.com/uj2JaPH.jpg',
                //     'workerName':'Worker Name1',
                //     'Work':'Work Name1',
                //     'title':'Title1',
                //     'message':'Message1',
                //     'workPorgressStatus':5,
                //     'billList':[
                //         {
                //         "list_id": "11",
                //         "price": "501",
                //         "work": "Condencer1"
                //         },
                //         {
                //         "list_id": "21",
                //         "price": "2001",
                //         "work": "Repairing1"
                //         }
                //     ],
                // },
                // {
                //     'workerAvtar':'https://i.imgur.com/uj2JaPH.jpg',
                //     'workerName':'Worker Name2',
                //     'Work':'Work Name2',
                //     'title':'Title2',
                //     'message':'Message2',
                //     'workPorgressStatus':4,
                //     'billList':[
                //         {
                //         "list_id": "12",
                //         "price": "502",
                //         "work": "Condencer2"
                //         },
                //         {
                //         "list_id": "22",
                //         "price": "2002",
                //         "work": "Repairing2"
                //         }
                //     ],
                // },
                // {
                //     'workerAvtar':'https://i.imgur.com/uj2JaPH.jpg',
                //     'workerName':'Worker Name3',
                //     'Work':'Work Name3',
                //     'title':'Title3',
                //     'message':'Message3',
                //     'workPorgressStatus':3,
                //     'billList':[
                //         {
                //         "list_id": "13",
                //         "price": "503",
                //         "work": "Condencer3"
                //         },
                //         {
                //         "list_id": "23",
                //         "price": "2003",
                //         "work": "Repairing3"
                //         }
                //     ],
                // },
                // {
                //     'workerAvtar':'https://i.imgur.com/uj2JaPH.jpg',
                //     'workerName':'Worker Name4',
                //     'Work':'Work Name4',
                //     'title':'Title4',
                //     'message':'Message4',
                //     'workPorgressStatus':2,
                //     'billList':[
                //         {
                //         "list_id": "14",
                //         "price": "504",
                //         "work": "Condencer4"
                //         },
                //         {
                //         "list_id": "24",
                //         "price": "2004",
                //         "work": "Repairing4"
                //         }
                //     ],
                // },
              ],
        }
    }
    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
        this.render_userServiceHist();
    }

    render_userServiceHist = async (argument) => {
        var connectionInfoLocal = '';
        var KEY = await AsyncStorage.getItem('userToken_S');
        var customerID = await AsyncStorage.getItem('UserID');
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
                fetch(Global.API_URL+'render_userServiceHist_US', {
                    method: 'POST',
                    headers: {
                            'Accept': 'application/json',
                            'Authorization':'Bearer '+KEY,
                        },
                        body: JSON.stringify({ 
                            profileID:customerID,
                         })
                    }).then((response) => response.json())
                    .then((responseJson) => {
                        var itemsToSet = responseJson.data;
                        console.log('resp:',responseJson);
                        if(responseJson.received == 'yes'){
                            this.setState({
                                LodingModal:false,
                                serviceHistListData:itemsToSet,
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
                    this.render_userServiceHist();
                });
            }
        });
        console.log(connectionInfoLocal);
    }
    render() {
        const {renderCoponentFlag} = this.state;
        const ServiceHistList = this.state.serviceHistListData;
        if(renderCoponentFlag){
            return(
                <Container>
                    <List dataArray={ServiceHistList}
                            renderRow={(item) =>
                            <ListItem thumbnail onPress={()=>{
                                // console.log("category screen button",item);
                                this.props.navigation.navigate('HistoryDetailsScreen',{
                                    Bill:item
                                });
                                
                            }}>
                                <Left>
                                    <Thumbnail square source={{ uri: item.workerAvtar }} />
                                </Left>
                                <Body>
                                    <Text style={{fontSize:18,fontWeight:'500'}}>{item.workerName}</Text>
                                    <View style={{flexDirection:'row'}} numberOfLines={1}>
                                        <Text style={{
                                                fontWeight:'500',
                                                fontSize:15,
                                                backgroundColor:'#ffa329',
                                                color:'white',
                                                borderRadius:5,
                                                paddingHorizontal:5
                                            }}>
                                                Status
                                        </Text>
                                        
                                        <Text style={{
                                            fontWeight:'500',
                                            fontSize:15,
                                            color:'#6eda44',
                                            borderRadius:5,
                                            // paddingHorizontal:5
                                        }}>
                                            {item.workPorgressStatus >=0.5 ? <Icon name="arrow-right-bold-box" size={20}/> : <Icon name="arrow-right-bold-box-outline" size={20}/>}
                                            {item.workPorgressStatus >=1.5 ? <Icon name="arrow-right-bold-box" size={20}/> : <Icon name="arrow-right-bold-box-outline" size={20}/>}
                                            {item.workPorgressStatus >=2.5 ? <Icon name="arrow-right-bold-box" size={20}/> : <Icon name="arrow-right-bold-box-outline" size={20}/>}
                                            {item.workPorgressStatus >=3.5 ? <Icon name="arrow-right-bold-box" size={20}/> : <Icon name="arrow-right-bold-box-outline" size={20}/>}
                                            {item.workPorgressStatus >=4.5 ? <Icon name="arrow-right-bold-box" size={20}/> : <Icon name="arrow-right-bold-box-outline" size={20}/>}
                                        </Text>
                                        
                                       
                                        
                                    </View>
                                    <Text style={{fontSize:15,}}>{item.title} </Text>
                                    <Text style={{color:'#0088e0',fontWeight:'500'}}>{item.Work} </Text>
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