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

export default class ServiceManProfileScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            LodingModal: false,
            profileData:[
                // {
                //     avtar:'https://instagram.fpat1-1.fna.fbcdn.net/vp/84c4e443d47dc2aa70a613a017a4c001/5CBB0AAC/t51.2885-19/s150x150/31908285_2109461939310314_4190149362170462208_n.jpg?_nc_ht=instagram.fpat1-1.fna.fbcdn.net',
                //     name:'Aarav Kumar',
                //     searched:'100',
                //     contract:'3000',
                //     ratting:'4.5',
                //     startHour:'10:00',
                //     endHour:'04:00',
                //     experi:'5',
                //     addList:[
                //         {   key:'State',value:'Bihar'},
                //         {   key:'City',value:'Bhagalpur'},
                //         {   key:'Pincode',value:'812002'},
                //         {   key:'Address',value:'Room no:3,Block-17,South Colony,Nayabazar,Bhagalpur'},
                //     ],
                //     workList : [
                //         {   key:'Temp Reparing',value:'4000-8524'},
                //         {   key:'Computer Reparing',value:'500-855'},
                //         {   key:'HDD',value:'8000-8855'},
                //         {   key:'Wirring',value:'5150-6520'},
                //     ],
                // }
                {
                    workerID:'0',
                    avtar:'https://i.imgur.com/uj2JaPH.jpg',
                    name:'Name',
                    searched:'0',
                    contract:'0',
                    ratting:'0',
                    startHour:'00:00',
                    endHour:'00:00',
                    experi:'0',
                    addList:[
                        {   key:'State',value:'----'},
                        {   key:'City',value:'----'},
                        {   key:'Pincode',value:'----'},
                        {   key:'Address',value:'----'},
                    ],
                    workList : [
                        {   'key':'work','value':'000-0000' , 'workSubCatId':'0' }
                        
                    ],
                    contactNo:'0000000000'
                }
            ],
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
        const {renderCoponentFlag} = this.state;
        
        const ServiceManList = this.props.navigation.getParam('ProfileData', this.state.profileData);
        
        // console.log("profileData:",ServiceManList);
        console.log("profileData:",ServiceManList.avtar);

        if(renderCoponentFlag){
            // const subcategory = this.props.navigation.getParam('ProfileData', []);
            // console.log("subcategory",subcategory);
            //
            return(
                <Container>
                    <View style={{flex: 1}}>
                        <ScrollView>
                            <Card>
                                <CardItem>
                                    <Thumbnail square source={{ uri: ServiceManList.avtar }} />
                                    <Text style={{marginLeft:10,fontSize:25,fontWeight:'700'}}>{ServiceManList.name}</Text>
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
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{fontSize:23}}>{ServiceManList.searched}<Icon name="account-search" style={{ color: 'black',fontSize:23 }}></Icon></Text>
                                            <Text style={{ fontSize: 10, color: 'grey',fontSize:12 }}>Searched</Text>
                                        </View>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{fontSize:23}}>{ServiceManList.contract}<Icon name="checkbox-marked-circle" style={{ color: '#63af04',fontSize:23 }}></Icon></Text>
                                            <Text style={{ fontSize: 10, color: 'grey',fontSize:12 }}>Contract</Text>
                                        </View>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{fontSize:23}}>{ServiceManList.ratting}<Icon name="star" style={{ color: 'black',fontSize:23 }}></Icon></Text>
                                            <Text style={{ fontSize: 10, color: 'grey',fontSize:12 }}>Ratting</Text>
                                        </View>
                                     </View>

                                </CardItem>
                            </Card>
                            <Card>
                                <CardItem style={{flex:1,flexDirection:'row',justifyContent: 'space-around',}}>
                                <View style={{ alignItems: 'center' }}>
                                        <Text style={{fontSize:23}}>{ServiceManList.startHour}</Text>
                                        <Text style={{ fontSize: 10, color: 'grey',fontSize:12 }}>Start Hour </Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{fontSize:23}}>{ServiceManList.endHour}</Text>
                                        <Text style={{ fontSize: 10, color: 'grey',fontSize:12 }}>End Hour </Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{fontSize:23}}>{ServiceManList.experi}+</Text>
                                        <Text style={{ fontSize: 10, color: 'grey',fontSize:12 }}>Experience </Text>
                                    </View>
                                    <Button  transparent onPress={()=>{this._handleCall(ServiceManList.contactNo)}}>
                                        <Icon name="phone" style={{fontSize:32,color:"#17b003",fontWeight:'900'}}/>
                                    </Button>
                                </CardItem>
                            </Card>
                            <Separator bordered>
                                <Text>Address</Text>
                            </Separator>                            
                            <Card>
                                
                                <List dataArray={ServiceManList.addList}
                                    renderRow={(item) =>
                                        <CardItem>
                                            <Left><Text style={{fontWeight:'800'}}>{item.key}:</Text></Left>
                                            <Right><Text>{item.value}</Text></Right>
                                        </CardItem>
                                    }>
                                </List>
                            </Card>
                            <Separator bordered>
                                <Text>Work List</Text>
                            </Separator>
                            <Card>
                                
                                <List dataArray={ServiceManList.workList}
                                    renderRow={(item) =>
                                        <CardItem>
                                            <Left><Text style={{fontWeight:'800'}}>{item.key}:</Text></Left>
                                            <Right><Text>{item.value}</Text></Right>
                                        </CardItem>
                                    }>
                                </List>
                            </Card>
                        </ScrollView>
                        <Button block  style={{backgroundColor:'#0088e0'}} onPress={()=>{
                            console.log("service profile screen button"); 
                            this.props.navigation.navigate('HireMeScreen',{
                                profileData:ServiceManList
                            });
                        }}>
                            <Text>Hire ME</Text>
                        </Button>
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