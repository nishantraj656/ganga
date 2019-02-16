import React, { Component } from "react";
import {
    StyleSheet,
    ImageBackground ,
    View,
    Dimensions,
    Image,
    Modal,
    TouchableOpacity,
    Linking,
    NetInfo,
    AsyncStorage,
    ToastAndroid,

} from "react-native";
import { Container, Spinner, Button,Text, Item,Input,CheckBox,Body} from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import { } from 'react-native-elements'

import Global from '../../constants/Global';
import KeyboardShift from "../../components/KeyboardShift";
const {height,width} = Dimensions.get('window');
export default class SingupScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            
            submitButtonDisable:false,
            


            reg_email:'',
            reg_phone:'',
            reg_password:'',
            reg_submitButtonDisable:false,


            reg_email_valid_color:'white',
            reg_phone_valid_color:'white',
            reg_password_valid_color:'white',

            

            reg_email_valid_icon:'check-circle',
            reg_phone_valid_icon:'check-circle',
            reg_password_valid_icon:'check-circle',

            
            avilEmail:true,
            avilPhone:true,

            

        }
    }
    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
    }

   
    _signInAsync = async (token,profileData,userID) => {
        userID = userID + "";//converting to string
        console.log("setting token");
        await AsyncStorage.setItem('Token', token);
        console.log("setting user data");
        await AsyncStorage.setItem('userID', userID);

        await AsyncStorage.setItem('userProfileData', profileData);
        console.log("sending to home");
        this.props.navigation.navigate('Home');
        console.log("seneing to app");
    };
    saveNotificationToken = () => {
        console.log("noti");
    }
    

    // handle regiter 
    submitRegister = () =>{
        if(
            
            this.state.reg_phone_valid_color != 'green' ||
            this.state.reg_email_valid_color != 'green' ||
            this.state.reg_password_valid_color != 'green' ||
            this.state.avilEmail != true ||
            this.state.avilPhone != true
        ){
            console.log(this.state.reg_phone_valid_color,this.state.reg_email_valid_color,
                this.state.reg_password_valid_color,this.state.avilEmail,this.state.avilPhone )
            alert("All fields must be filled correctly.");
            return;
        }
        if(
            this.state.reg_email.trim().length == 0 || 
            this.state.reg_password.trim().length == 0 || 
            this.state.reg_phone.trim().length == 0  
        ){
            alert("All Fields are required")
            return;
        }
        if(!this.validateEmail(this.state.reg_email.trim())){
            alert("Invalid Email! Try again!!!");
            return;
        }



        // now sending request to login
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
            this.setState({reg_submitButtonDisable:true});
            var email = this.state.reg_email.toLowerCase();
            var password = this.state.reg_password;
            var phone = this.state.reg_phone;
            console.log(":",email,":",password,":",password,":",phone);
            fetch(Global.API_URL+'register_MU', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    'name':'',
                    'email':email,
                    'password':password,
                    'c_password':password,
                    'phone':phone,
                    'user_type':'user',
                     noti_token:Date()+"",

                })
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if(responseJson.error != undefined){
                    alert("Internal Server error 5004");
                    this.setState({reg_submitButtonDisable:false});
                    return;
                }
                var itemsToSet = responseJson.success.token; 
                var profileData = responseJson.profileData;
                var userID = responseJson.userID;
                if(responseJson.reg_done == 'yes'){
                    console.log("now calling to signin and sending to home");
                    this._signInAsync(itemsToSet,JSON.stringify(profileData),userID);
                    this.setState({reg_submitButtonDisable:false});
                    return;
                }else{
                    alert("Invalid Email or Password");
                    this.setState({reg_submitButtonDisable:false});
                }
                }).catch((error) => {
                    alert("Internal Server Error 500");
                    console.log("on error featching:"+error);
                    this.setState({reg_submitButtonDisable:false});
            });
        }
        });
        console.log(connectionInfoLocal);
    }
    validateEmail = (email) => {
        var re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    validateName = (name)=>{
        return !/[^a-zA-Z ]/.test(name);
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
    REGcheckPassword = (text) =>{
        //validating password
        if(text.trim().length != 0){
            if(text.length >= 4){
                this.setState({
                    reg_password_valid_color:'green',
                    reg_password_valid_icon:'check-circle'
                });
                console.log("valid password");
            }else{
                this.setState({
                    reg_password_valid_color:'red',
                    reg_password_valid_icon:'close-circle'
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
    checkAvilPhone = () =>{
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
                        phone:this.state.reg_phone,
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
    // forgot password attat
    forgotPasswordStart = ()=>{
        this.setState({
            loginModelVisible:false,
            signUpModelVisible:false,
            forgotModelVisible:true,

             // forgot passwrod
             forgot_email:'',
             forgot_email_edit:true,
             forgot_email_valid_icon:'check-circle',
             forgot_email_valid_color:'white',
             forgot_avilEmail:true,
             OTPEntered:'',
             OTPreal:'0',
             forgot_OTP_edit:true,
 
             forgot_password_valid_icon:'check-circle',
             forgot_confirm_valid_icon:'check-circle',
             forgot_password_valid_color:'white',
             forgot_confirm_valid_color:'white',
             forgot_sendOTPButtonDisable:false,
             askOTP:false,
        })
    }
    
    render() {
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container style={{backgroundColor:'#2268d7'}}>
                    <KeyboardShift>{()=>(
                        <View style={{flex:1,backgroundColor:'#2162ca'}}>
                            <View style={{marginTop:15,height:height*(0.4),flex:4}}>
                                <View style={{margin:10,flexDirection:'row',justifyContent: 'space-between',}}>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={{color:'#fff',fontSize:25,fontWeight:'600',alignSelf:'center'}}>GangaCart</Text>
                                        <Image style={{height:30,width:30,alignSelf:'center',marginHorizontal:5}} source={{uri:'https://i.imgur.com/QtXcFQM.png'}}/>
                                    </View>
                                    <TouchableOpacity style={{alignContent:'flex-end',alignItems:'flex-end',alignSelf:'center'}} onPress={this.forgotPasswordStart} >
                                        <Icon name="close" style={{alignSelf:'flex-end',fontSize:30,color:'#fff'}}/>
                                    </TouchableOpacity>    
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'space-around',margin:10,marginHorizontal:20,marginVertical:50,alignSelf:'center'}}>
                                    <Text style={{color:"#fff",width:'80%'}}>Sign UP to be in touch with us and get spiecal offer and products for you</Text>
                                    <Image
                                        style={{width: '20%', height: 50}}
                                        source={{uri: 'https://i.imgur.com/QtXcFQM.png'}}
                                    />
                                </View>
                                
                            </View>
                            <View style={{ flex: 6,height: height*(0.6),  width: width,backgroundColor:"#ffffff",flexDirection: 'column', justifyContent: 'center', alignItems: 'center',borderRadius:0.2,borderColor:'#fff'}}>

                                    <View style={{ width: width*(0.85), alignSelf:'center',marginVertical:5}}>
                                        
                                        <Item  regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                            <Input 
                                                placeholder='Email' 
                                                onChangeText={(text) => {
                                                    this.REGcheckEmail(text);
                                                    this.setState({reg_email:text})
                                                    this.checkAvilEmail(text);
                                                }}
                                                textContentType='emailAddress'
                                                returnKeyType='next'
                                                keyboardType='email-address'
                               

                                            />
                                            <Icon name={this.state.reg_email_valid_icon} style={{color:this.state.reg_email_valid_color,fontSize:25}}/>
                                        </Item>
                                        { this.state.reg_email_valid_color == 'red' && 
                                            <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Not a Valid Email Format.</Text>
                                        }
                                        { this.state.avilEmail == false && 
                                            <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*This email is already registered with us.</Text>
                                        }
                                        <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                            <Input 
                                                placeholder='Phone NO'
                                                onChangeText={(text) => {
                                                    this.REGcheckPhone(text);    
                                                    this.setState({reg_phone:text})
                                                    this.checkAvilPhone()
                                                }}
                                                textContentType='telephoneNumber'
                                                returnKeyType='next'
                                                keyboardType='numeric' 
                                                maxLength={10}  


                                            />
                                            <Icon name={this.state.reg_phone_valid_icon} style={{color:this.state.reg_phone_valid_color,fontSize:25}}/>
                                        </Item>
                                        { this.state.reg_phone_valid_color == 'red' && 
                                            <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Phone no must be 10 Digit long.</Text>
                                        }
                                        { this.state.avilPhone == false && 
                                            <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*This moible no is already registered with us.</Text>
                                        }
                                        <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                            <Input 
                                                placeholder='Password'
                                                onChangeText={(text) => {
                                                    this.REGcheckPassword(text);
                                                    this.setState({reg_password:text})
                                                }}
                                                textContentType='password' 
                                                returnKeyType='next'
                                                secureTextEntry={true}
                                               
                                            />
                                            <Icon name={this.state.reg_password_valid_icon} style={{color:this.state.reg_password_valid_color,fontSize:25}}/>
                                        </Item>  
                                        { this.state.reg_password_valid_color == 'red' && 
                                            <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Password Must be at least 4 character Long.</Text>
                                        }
                                        <Button block 
                                            style={{color:'#fff',backgroundColor:'#fb641b',marginVertical:5}}
                                            onPress={this.submitRegister}
                                            disabled = {this.state.submitButtonDisable}
                                        >
                                            <Text>SIGN UP</Text>
                                        </Button>
                                        <Button block bordered primary   
                                            style={{marginVertical:5}}
                                            onPress={()=>{
                                                this.props.navigation.navigate('LoginScreen');
                                            }}
                                        >
                                            <Text>Existing User? SIGN IN </Text>
                                        </Button>
                                    </View>
                            </View>
                        </View>
                    )}</KeyboardShift>
                </Container>
            );
        }else{
            return (
                <View style={styles.loder}>
                <Spinner  color='blue'/>
                </View>
            );
        }
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