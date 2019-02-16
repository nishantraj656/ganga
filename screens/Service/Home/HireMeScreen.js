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
    Form,
    Picker,
    Item,
    Textarea,
    Label,
    Thumbnail
} from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from "../../../constants/Global";

const {width,height} = Dimensions.get('window');

export default class HireMeScreen extends Component {
    constructor(props){
        super(props);
        let nav = this.props.navigation;
        console.log("hireme contrller:",nav.getParam('profileData'));
        this.state = {
            renderCoponentFlag: false,
            LodingModal: false,
            submitButtonDisalbe:false,
            workerAvtar: nav.getParam('profileData', {avtar:'https://i.imgur.com/uj2JaPH.jpg'}).avtar,
            workerName:nav.getParam('profileData', {name:'-----'}).name,
            workerID: nav.getParam('profileData', {workerID:'--'}).workerID,
            workList: nav.getParam('profileData',{workList:[{   'key':'work','value':'000-0000' , 'workSubCatId':'10' },{   'key':'work1','value':'000-00001' , 'workSubCatId':'1' }]}).workList,
            WorkSubCatID: '0',
            message: 'Nan',
            title: 'Nan',
        }
    }
    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
    }
    render_HandleSendRequest = async () => {
        var connectionInfoLocal = '';
        var KEY = await AsyncStorage.getItem('Token');
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
                if(this.state.title.trim.length == 0){
                    this.setState({
                        title:'A work'
                    })
                } 
                if(this.state.message.trim.length == 0 ){
                    this.setState({
                        message:'Call me now'
                    })
                }
                if(this.state.WorkSubCatID == 0 ){
                    this.setState({
                        WorkSubCatID:this.state.workList[0].workSubCatId
                    })
                    
                }
                console.log("work id wor_subcat_id 0 :"+this.state.wor_subcat_id);
                this.setState({
                    LodingModal:true,
                    submitButtonDisalbe:true,
                })
                fetch(Global.API_URL+'render_HandleSendRequest_HierMe_US', {
                    method: 'POST',
                    headers: {
                            'Accept': 'application/json',
                            'Authorization':'Bearer '+KEY,
                        },
                        body: JSON.stringify({ 
                            workerID: this.state.workerID,
                            WorkSubCatID: this.state.WorkSubCatID,
                            customerID: customerID,
                            message: this.state.message,
                            title: this.state.title,
                         })
                    }).then((response) => response.json())
                    .then((responseJson) => {
                        var itemsToSet = responseJson.data;
                        console.log('resp:',responseJson);
                        if(responseJson.received == 'yes'){
                            this.setState({
                                LodingModal:false,
                                
                            });
                            ToastAndroid.showWithGravityAndOffset(
                                'Successuly Sent',
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                                25,
                                50,
                            );
                        }else{
                            ToastAndroid.showWithGravityAndOffset(
                                'Internal Server Error',
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                                25,
                                50,
                            );
                        }
                        
                        // this.props.navigation.navigate('BackTOHome',{
                        //     ProfileData:itemsToSet,
                        // });
                }).catch((error) => {
                    ToastAndroid.showWithGravityAndOffset(
                        'Network Failed!!! Retrying...',
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50,
                    );
                    console.log('on error fetching:'+error);
                    this.render_HandleSendRequest();
                    this.setState({
                        submitButtonDisalbe:false,
                    })
                });
            }
        });
        console.log(connectionInfoLocal);
    }
    render() {
        const {renderCoponentFlag} = this.state;
        let workList = this.state.workList.map( (s, i) => {
            return <Picker.Item key={i} value={s.workSubCatId} label={s.key} />
        });
        if(renderCoponentFlag){
            return(
                <Container>
                    <Content>
                        <Card>
                            <CardItem>
                                <Thumbnail square source={{ uri: this.state.workerAvtar }} />
                                <Text style={{marginLeft:10,fontSize:25,fontWeight:'700'}}>{this.state.workerName}</Text>
                            </CardItem>
                        </Card>
                        <Card>
                            <Form>
                                <Item>
                                    
                                    <Picker    
                                        mode="dropdown"
                                        style={{  width: '70%', height:32 }}
                                        selectedValue={this.state.SelectedCategory}
                                        onValueChange={(itemValue, itemIndex) => {
                                            console.log("itemvalue:",itemValue+" Item inedex:"+itemIndex);
                                            this.setState({WorkSubCatID: itemValue});
                                        }}
                                        >
                                        {workList}
                                    </Picker>
                                </Item>
                                
                                <Item regular>
                                    <Input 
                                        placeholder='Enter your work Title'
                                        onChangeText={(text) => this.setState({title:text})} 
                                        />
                                </Item>
                                <Textarea 
                                    rowSpan={5} bordered 
                                    placeholder="Type Some Message..." 
                                    onChangeText={(text) => this.setState({message:text})} 
                                    />
                                <Button block danger
                                disabled={this.state.submitButtonDisalbe} onPress={this.render_HandleSendRequest}>
                                    <Text>Send Him A Request</Text>
                                </Button>
                            </Form>
                        </Card>
                    
                    </Content>
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