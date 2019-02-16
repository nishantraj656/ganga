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
    ScrollView
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
import { Avatar } from 'react-native-elements';
import KeyboardShift from "../../components/KeyboardShift";
import Global from "../../constants/Global";

const {width,height} = Dimensions.get('window');

export default class EditProfile extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            LodingModal: false,
            profile_name:'',
            profile_phonheno:'',
            profile_email:'',
            submitProfileBasic:false,

            shipping_state:'Bihar',
            shipping_city:'Bhagalpur',
            shipping_street:'',
            shipping_pincode:'',
            submitShippingDetails:false,

            userID:'',


            // checking email
            reg_email_valid_color:'green',
            reg_email_valid_icon:'check-circle',
            reg_phone_valid_color:'green',
            reg_phone_valid_icon:'check-circle',
            
            avilEmail:true,
            avilPhone:true,

            
        }
    }
    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
        this.setProfile();
    }


    validateEmail = (email) => {
        var re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    validatephone = (phone) =>{
        return /^[0-9]+$/.test(phone);
    }
    
    REGcheckEmail = (text) =>{
        // valdating email
        if(text.trim().length != 0 ){
            if(this.validateEmail(text) && text.length > 5){
                this.setState({
                    reg_email_valid_color:'green',
                    reg_email_valid_icon:'check-circle'
                });
                console.log("valid email");
            }else{
                this.setState({
                    reg_email_valid_color:'red',
                    reg_email_valid_icon:'close-circle'
                });
            }
        }
    }

    
    REGcheckPhone = (text) =>{
        //validation phone
        console.log(text.trim().length);
        if(text.trim().length != 0){
            if(this.validatephone(text) && text.length == 10){
                this.setState({
                    reg_phone_valid_color:'green',
                    reg_phone_valid_icon:'check-circle'
                });
                console.log("valid phone");
            }else{
                this.setState({
                    reg_phone_valid_color:'red',
                    reg_phone_valid_icon:'close-circle'
                });
            }
        }
    }

    checkAvilEmail = (text) =>{
        // now sending request to login
        console.log("Checking for avil email");

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
                fetch(Global.API_URL+'AvilEmail_MU', {
                    method: 'POST',
                    headers: {},
                    body: JSON.stringify({
                        email:text,
                        check:'email',
                    })
                }).then((response) => response.json())
                .then((responseJson) => {
                    var itemsToSet = responseJson.data ;
                    console.log("resp:",itemsToSet);
                    if(itemsToSet.status == true){
                        this.setState({
                            avilEmail:true,
                        })
                    }else{
                        this.setState({
                            avilEmail:false,
                        })
                    }

                }).catch((error) => {
                        alert("Internal Server Error 500");
                        console.log("on error featching:"+error);
                });
            }
        });
    }
    checkAvilPhone = (text) =>{
        console.log("Checking for avil phone");
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
                fetch(Global.API_URL+'AvilPhone_MU', {
                    method: 'POST',
                    headers: {},
                    body: JSON.stringify({
                        phone: text,
                        check:'phone',
                    })
                }).then((response) => response.json())
                .then((responseJson) => {
                    var itemsToSet = responseJson.data ;
                    console.log("resp:",itemsToSet);
                    if(itemsToSet.status == true){
                        this.setState({
                            avilPhone:true,
                        })
                    }else{
                        this.setState({
                            avilPhone:false,
                        })
                    }

                }).catch((error) => {
                        alert("Internal Server Error 500");
                        console.log("on error featching:"+error);
                });
            }
        });
    }
    setProfile = async () =>{
        const profileData = JSON.parse(await AsyncStorage.getItem('userProfileData'));

        console.log(profileData);

        this.setState({
            profile_name: profileData.cname,
            profile_email: profileData.email,
            profile_phonheno: profileData.phone+'',

            shipping_state: profileData.state,
            shipping_city: profileData.city,
            shipping_street: profileData.address,
            shipping_pincode: profileData.cpin+"",

            userID: profileData.user_id,
        });
        console.log(this.state.profile_name,this.state.profile_email,this.state.profile_phonheno,this.state.shipping_state,this.state.shipping_city,this.state.shipping_street,this.state.shipping_pincode);
    }
    render_setBasicProfile = async (argument) => {
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

                if(
            
                    this.state.reg_phone_valid_color != 'green' ||
                    this.state.reg_email_valid_color != 'green' ||
                    this.state.avilEmail != true ||
                    this.state.avilPhone != true
                ){
                    console.log(this.state.reg_phone_valid_color,this.state.reg_email_valid_color,
                        this.state.avilEmail,this.state.avilPhone )
                    alert("All fields must be filled correctly.");
                    return;
                }

                this.setState({
                    submitProfileBasic:true,
                });
                fetch(Global.API_URL+'render_setBasicProfile_MU', {
                    method: 'POST',
                    headers: {
                            'Accept': 'application/json',
                            'Authorization':'Bearer '+KEY,
                        },
                        body: JSON.stringify({ 
                            profile_name:this.state.profile_name+'',
                            profile_phonheno:this.state.profile_phonheno+'',
                            profile_email:this.state.profile_email+'',

                            userID: this.state.userID,
                         })
                    }).then((response) => response.json())
                    .then((responseJson) => {
                        var itemsToSet = responseJson.data;
                        console.log('resp:',responseJson);
                        if(responseJson.received == 'yes'){
                            
                            let profileData = JSON.stringify(itemsToSet);
                            console.log(profileData);
                            this.SaveProfileData(profileData);
                            
                            ToastAndroid.showWithGravityAndOffset(
                                'Basic Details Saved',
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
                        this.setState({
                            submitProfileBasic:false,
                        });
                }).catch((error) => {
                    ToastAndroid.showWithGravityAndOffset(
                        'Network Failed!!! Retrying...',
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50,
                    );
                    console.log('on error fetching:'+error);
                    this.render_setBasicProfile();
                });
            }
        });
        console.log(connectionInfoLocal);
    }
    render_setShippingAddress = async (argument) => {
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
                    submitShippingDetails:true,
                });
                fetch(Global.API_URL+'render_setShippingAddress_MU', {
                    method: 'POST',
                    headers: {
                            'Accept': 'application/json',
                            'Authorization':'Bearer '+KEY,
                        },
                        body: JSON.stringify({ 
                            shipping_state:this.state.shipping_state+'',
                            shipping_city:this.state.shipping_city+'',
                            shipping_street:this.state.shipping_street+'',
                            shipping_pincode:this.state.shipping_pincode+'',

                            userID: this.state.userID,
                         })
                    }).then((response) => response.json())
                    .then((responseJson) => {
                        var itemsToSet = responseJson.data;
                        console.log('resp:',responseJson);
                        if(responseJson.received == 'yes'){
                            // 
                            let profileData = JSON.stringify(itemsToSet);
                            console.log(profileData);
                            this.SaveProfileData(profileData);
                            ToastAndroid.showWithGravityAndOffset(
                                'Shipping Details Saved',
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
                        this.setState({
                            submitShippingDetails:false,
                        });
                }).catch((error) => {
                    ToastAndroid.showWithGravityAndOffset(
                        'Network Failed!!! Retrying...',
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                        25,
                        50,
                    );
                    console.log('on error fetching:'+error);
                    this.render_setShippingAddress();
                });
            }
        });
        console.log(connectionInfoLocal);
    }
    SaveProfileData = async (profileData) => {
        
        await AsyncStorage.setItem('userProfileData', profileData);
    };
    render() {
        
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container>
                    
                        <KeyboardShift>
                            {()=>(
                                <Content>
                                    <View style={{flex:1}}>
                                        <View style={{flex:4,backgroundColor:'#2873f0',height:height*(0.15)}}>
                                            <View style={{alignSelf:'center',alignContent:'center',alignItems:'center',marginVertical:10}}>
                                                <Avatar 
                                                    onPress={()=>{console.log("change Picture")}}
                                                    size='large'
                                                    source={{
                                                        uri:
                                                        'https://instagram.fpat1-1.fna.fbcdn.net/vp/dce4af24219a91eddff731d00cae9ed7/5CE9B8C6/t51.2885-19/s150x150/17933956_832093003610694_4703758160064675840_a.jpg?_nc_ht=instagram.fpat1-1.fna.fbcdn.net',
                                                    }}
                                                    showEditButton
                                                    rounded
                                                    title={this.state.profile_name.substr(0,2)}
                                                />
                                            </View>
                                        </View>
                                        <View style={{flex:6,backgroundColor:'#fff'}}>
                                            <Card>
                                                <CardItem>
                                                    <Item floatingLabel>
                                                        <Label style={{color:'#2873f0'}}>Name</Label>
                                                        <Input underlineColorAndroid="#2873f0" 
                                                            onChangeText={(text) => this.setState({profile_name:text})}
                                                            value={this.state.profile_name}
                                                        />
                                                    </Item>
                                                </CardItem>
                                                <CardItem>
                                                    <Item floatingLabel>
                                                        <Label style={{color:'#2873f0'}}>Phone NO</Label>
                                                        <Input underlineColorAndroid="#2873f0" 
                                                            value={this.state.profile_phonheno}
                                                            onChangeText={(text) => {
                                                                this.setState({profile_phonheno:text});
                                                                this.REGcheckPhone(text);    
                                                                this.checkAvilPhone(text);
                                                            }}
                                                            keyboardType='numeric' 
                                                            maxLength={10}
                                                        />
                                                        
                                                    </Item>
                                                </CardItem>
                                                
                                                { 
                                                    this.state.reg_phone_valid_color == 'red' && 
                                                    <CardItem><Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Phone no must be 10 Digit long.</Text></CardItem>
                                                }
                                                

                                                
                                                { 
                                                    this.state.avilPhone == false && 
                                                    <CardItem><Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*This moible no is already registered with us.</Text></CardItem>
                                                }

                                                
                                                <CardItem>
                                                    <Item floatingLabel>
                                                        <Label style={{color:'#2873f0'}}>Email</Label>
                                                        <Input underlineColorAndroid="#2873f0" 
                                                            onChangeText={(text) => {
                                                                this.setState({profile_email:text});
                                                                
                                                                this.REGcheckEmail(text);
                                                                this.checkAvilEmail(text);
                                                            }}
                                                            value={this.state.profile_email}
                                                            keyboardType='email-address' 
                                                        />
                                                        
                                                    </Item>
                                                </CardItem>
                                                
                                                { 
                                                    this.state.reg_email_valid_color == 'red' && 
                                                    <CardItem><Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Not a Valid Email Format.</Text></CardItem>
                                                }
                                                
                                                
                                                { 
                                                    this.state.avilEmail == false && 
                                                    <CardItem><Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*This email is already registered with us.</Text></CardItem>
                                                }
                                                
                                               
                                            </Card>
                                            <Card>
                                                {this.state.submitProfileBasic &&
                                                    <AdvLoder/>
                                                }
                                                {this.state.submitProfileBasic != true &&
                                                    <Button transparent block 
                                                        disabled={this.state.submitProfileBasic}
                                                        onPress={()=>{
                                                            
                                                            console.log("Chnage Basic Details");
                                                            console.log(this.state.profile_name,this.state.profile_phonheno,this.state.profile_email)
                                                            this.render_setBasicProfile();
                                                        }}>
                                                        <Text style={{fontSize:15,fontWeight:'500',color:'#2873f0'}}>SUBMIT</Text>
                                                    </Button>
                                                }
                                                
                                            </Card>
                                            

                                            {/* Shipping Address */}
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
                                                                    value={this.state.shipping_state}
                                                                    editable={false} 
                                                                    onChangeText={(text) => this.setState({shipping_state:text})}
                                                                    />
                                                            </Item>
                                                        </CardItem>
                                                        <CardItem>
                                                            <Item floatingLabel>
                                                                <Label style={{color:'#2873f0'}}>City</Label>
                                                                    <Input 
                                                                        underlineColorAndroid="#2873f0" 
                                                                        value={this.state.shipping_city} 
                                                                        editable={false} 
                                                                        onChangeText={(text) => this.setState({shipping_city:text})}
                                                                        />
                                                            </Item>
                                                        </CardItem>
                                                        <CardItem>
                                                            <Item floatingLabel>
                                                                <Label style={{color:'#2873f0'}}>Street</Label>
                                                                <Input 
                                                                    underlineColorAndroid="#2873f0" 
                                                                    onChangeText={(text) => this.setState({shipping_street:text})}
                                                                    value={this.state.shipping_street}
                                                                    />
                                                            </Item>
                                                        </CardItem>
                                                        <CardItem>
                                                            <Item floatingLabel>
                                                                <Label style={{color:'#2873f0'}}>Pincode</Label>
                                                                <Input 
                                                                    underlineColorAndroid="#2873f0"
                                                                    keyboardType='numeric' 
                                                                    onChangeText={(text) => this.setState({shipping_pincode:text})}
                                                                    value={this.state.shipping_pincode}
                                                                    />
                                                            </Item>
                                                        </CardItem>
                                                        
                                                        
                                                        
                                                        
                                                    </Body>
                                                </CardItem>

                                                {this.state.submitShippingDetails &&
                                                    <AdvLoder/>
                                                }
                                                {this.state.submitShippingDetails != true &&
                                                    <Button transparent block 
                                                        disabled={this.state.submitShippingDetails}
                                                        onPress={()=>{
                                                            console.log("Change Shipping Address");
                                                            console.log(this.state.shipping_city,this.state.shipping_state,this.state.shipping_street,this.state.shipping_pincode);
                                                            this.render_setShippingAddress();
                                                        }}>
                                                        <Text style={{fontSize:15,fontWeight:'500',color:'#2873f0'}}>SUBMIT</Text>
                                                    </Button>
                                                }
                                                    
                                            </Card>
                                            
                                        </View>
                                    </View>
                                </Content>
                            )}
                        </KeyboardShift>
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