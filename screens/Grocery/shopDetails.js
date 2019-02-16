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
    ScrollView,
    Linking
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
    Separator,
} from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
const {width,height} = Dimensions.get('window');

export default class ShopDetail extends Component {
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

    _handleCall = (str) => {
        console.log(this.state.connectionInfo);
        var phoneString = str.replace(/-/g, "");
        //console.log(phoneString);
        
        Linking.openURL(`tel:${phoneString}`);
    }

    render() {
        const { navigation } = this.props;
        const itemId = navigation.getParam('item', 'NO-ID');
        if(navigation){
            return(
                <Container>
                    <View style={{flex: 1}}>
                        <ScrollView>
                            <Card>
                                <CardItem>
                                    <Thumbnail square source={{ uri: itemId.pic }} />
                                    <Text style={{marginLeft:10,fontSize:25,fontWeight:'700'}}>{itemId.name}</Text>
                                </CardItem>
                            </Card>
                            <Card>
                                <CardItem>
                                    <View
                                      style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-around',
                                          alignItems: 'flex-end',
                                          flex: 1,
                                      }}>
                                        {/* <View style={{ alignItems: 'center' }}>
                                            <Text style={{fontSize:23}}>{itemId.searched}<Icon name="account-search" style={{ color: 'black',fontSize:23 }}></Icon></Text>
                                            <Text style={{ fontSize: 10, color: 'grey',fontSize:12 }}>Searched</Text>
                                        </View> */}
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{fontSize:23}}>{itemId.address}<Icon name="checkbox-marked-circle" style={{ color: '#63af04',fontSize:23 }}></Icon></Text>
                                            <Text style={{ fontSize: 10, color: 'grey',fontSize:12 }}>Contract</Text>
                                        </View>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{fontSize:23}}>{itemId.rating}<Icon name="star" style={{ color: 'black',fontSize:23 }}></Icon></Text>
                                            <Text style={{ fontSize: 10, color: 'grey',fontSize:12 }}>Ratting</Text>
                                        </View>
                                     </View>

                                </CardItem>
                            </Card>
                            <Card>
                                <CardItem style={{flex:1,flexDirection:'row',justifyContent: 'space-around',}}>
                                <View style={{ alignItems: 'center' }}>
                                        <Text style={{fontSize:23}}>8:00 PM</Text>
                                        <Text style={{ fontSize: 10, color: 'grey',fontSize:12 }}>Start Hour </Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{fontSize:23}}>9:00 AM</Text>
                                        <Text style={{ fontSize: 10, color: 'grey',fontSize:12 }}>End Hour </Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{fontSize:23}}>{itemId.experi}+</Text>
                                        <Text style={{ fontSize: 10, color: 'grey',fontSize:12 }}>Experience </Text>
                                    </View>
                                    <Button  transparent onPress={()=>{this._handleCall(itemId.mobile1)}}>
                                        <Icon name="phone" style={{fontSize:32,color:"#17b003",fontWeight:'900'}}/>
                                    </Button>
                                </CardItem>
                            </Card>
                            <Separator bordered>
                                <Text>Address</Text>
                            </Separator>                            
                            <Card>
                            <CardItem>
                                <Left><Text style={{fontWeight:'800'}}>Address :</Text></Left>
                                <Right><Text>{itemId.address}</Text></Right>
                            </CardItem>
                            <CardItem>
                                <Left><Text style={{fontWeight:'800'}}>State :</Text></Left>
                                <Right><Text>{itemId.state}</Text></Right>
                            </CardItem>
                            <CardItem>
                                <Left><Text style={{fontWeight:'800'}}>City :</Text></Left>
                                <Right><Text>{itemId.city}</Text></Right>
                            </CardItem>
                            <CardItem>
                                <Left><Text style={{fontWeight:'800'}}>Pin Code :</Text></Left>
                                <Right><Text>{itemId.Pin_Code}</Text></Right>
                            </CardItem>
                            </Card>
                            {/* <Separator bordered>
                                <Text>Work List</Text>
                            </Separator>
                            <Card>
                                
                                <List dataArray={itemId.workList}
                                    renderRow={(item) =>
                                        <CardItem>
                                            <Left><Text style={{fontWeight:'800'}}>{item.key}:</Text></Left>
                                            <Right><Text>{item.value}</Text></Right>
                                        </CardItem>
                                    }>
                                </List>
                            </Card> */}
                        </ScrollView>
                        {/* <Button block  style={{backgroundColor:'#0088e0'}} onPress={()=>{
                            console.log("service profile screen button"); 
                            this.props.navigation.navigate('HireMeScreen',{
                                profileData:itemId
                            });
                        }}>
                            <Text>Hire ME</Text>
                        </Button> */}
                    </View>
                        
                
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