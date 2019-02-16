import React, { Component } from "react";
import {
    StyleSheet,
    WebView ,
    View,
    AsyncStorage,
    NetInfo,
    Dimensions,
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
} from 'native-base';

import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from "../../../constants/Global";

export default class SubCategoryScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            LodingModal:false,
        }
    }
    componentDidMount() { 
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
    }
    render_ServiceManList = async (subcategoryID) => {
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
                fetch(Global.API_URL+'render_ServiceManList_US', {
                    method: 'POST',
                    headers: {
                            'Accept': 'application/json',
                            'Authorization':'Bearer '+KEY,
                        },
                        body: JSON.stringify({
                            subcategoryID:subcategoryID,
                        })
                    }).then((response) => response.json())
                    .then((responseJson) => {
                        var itemsToSet = responseJson.data;
                        console.log('resp serviceman list:',responseJson);
                        if(responseJson.received == 'yes'){
                            this.setState({
                                LodingModal:false,
                            });
                            this.props.navigation.navigate('ServiceManListScreen',{
                                ServiceManList:itemsToSet
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
                    this.render_ServiceManList();
                });
            }
        });
        console.log(connectionInfoLocal);
    }
    render() {
        const subcategory = this.props.navigation.getParam('subcategory', []);
        console.log("subcategory",subcategory);
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container>
                    <Content>
                        <Card>
                            <CardItem>
                                <Body>
                                    <Text style={{fontSize:30,fontWeight:'900'}}>
                                        SubCategories
                                    </Text>
                                    <Text style={{fontSize:15,color:'#a7a7a7'}}>
                                        Browse Service Man By SubCategory
                                    </Text>
                                </Body>
                            </CardItem>
                        </Card>
                        <List dataArray={subcategory}
                            renderRow={(item) =>
                            <ListItem onPress={()=>{
                                console.log("category screen button");
                                this.render_ServiceManList(item.key);
                            }}>
                                <Left>
                                    <Text style={{fontSize:20}}>{item.value}</Text>
                                </Left>
                                <Right>
                                        <Icon name="chevron-right" style={{fontSize:30,color:'#179ae1'}}/>
                                </Right>
                            </ListItem>
                            }>
                        </List>
                    </Content>
                    <Modal 
                        animationType="slide"
                        transparent={true}
                        visible={this.state.LodingModal}
                        onRequestClose={() => {
                            // this.setState({
                            //     LodingModal:false
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