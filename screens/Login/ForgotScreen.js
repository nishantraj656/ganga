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
export default class ForgotScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            loginModelVisible:false,
            
            forgot_submitButtonDisable:false,
            
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

        }
    }
    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
    }
   

    

    validateEmail = (email) => {
        var re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
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
    lastOTPSendSecCount = 0;
    OTP = 0 ;
    sendOTPForgot = () =>{
        if(this.state.forgot_email_valid_color == 'red' || this.state.forgot_avilEmail ){
            alert("Invalid Email ");
            return;
        }
        this.setState({
            forgot_email_edit:false,
            forgot_sendOTPButtonDisable:true,
        });
        var NOWSec = Math.floor(Date.now() / 1000);
        // console.log(NOWSec - this.lastOTPSendSecCount);
        if(NOWSec - this.lastOTPSendSecCount >= 60*5 ){
            this.OTP = Math.floor(Math.random() * (+999999 - +100000)) + +100000;
            this.setState({
                OTPreal:this.OTP,
            })
            this.lastOTPSendSecCount = NOWSec;

        }
        if(this.state.forgot_password_valid_color == 'red' || this.state.forgot_confirm_valid_color == 'red'){
            alert("Invalid Password");
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
                this.setState({forgot_sendOTPButtonDisable:true});
                var email = this.state.forgot_email.toLowerCase();
                console.log(":",email);
                fetch(Global.API_URL+'send_OTP_MU', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        'email':email,
                        'OTP':this.state.OTPreal,
                        'user_type':'worker',
                        noti_token:Date()+"",
    
                    })
                }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    if(responseJson.error != undefined){
                        alert("Internal Server error 5004");
                        this.setState({forgot_sendOTPButtonDisable:false});
                        return;
                    }
                    if(responseJson.data.sendOTP == 'yes'){
                        this.setState({askOTP:true});
                        ToastAndroid.showWithGravityAndOffset(
                            'OTP Sent! check your Email Folder Too..',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50,
                            ); 
                            
                        return;
                    }else{
                        alert("Somthing wrong! password Not Changed!!");
                        this.setState({forgot_sendOTPButtonDisable:false});
                    }
                    }).catch((error) => {
                        alert("Internal Server Error 500");
                        console.log("on error featching:"+error);
                        this.setState({forgot_sendOTPButtonDisable:false});
                });
            }
         });
        console.log(this.OTP);
        ToastAndroid.showWithGravityAndOffset(
            'OTP For Testing'+this.OTP,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
            );   
        
    }

    // forgot pass
    forgotcheckEmail = (text) =>{
        // valdating email
        if(text.trim().length != 0 ){
            if(this.validateEmail(text) && text.length > 5){
                this.setState({
                    forgot_email_valid_color:'green',
                    forgot_email_valid_icon:'check-circle'
                });
                console.log("valid email");
            }else{
                this.setState({
                    forgot_email_valid_color:'red',
                    forgot_email_valid_icon:'close-circle'
                });
            }
        }
    }

    forgotcheckAvilEmail = (text) =>{
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
                    console.log("respforgot_avilEmail:",itemsToSet);
                    if(itemsToSet.status == true){
                        this.setState({
                            forgot_avilEmail:true,
                        })
                    }else{
                        this.setState({
                            forgot_avilEmail:false,
                        })
                    }

                }).catch((error) => {
                        alert("Internal Server Error 500");
                        console.log("on error featching:"+error);
                });
            }
        });
    }
    forgotcheckPassword = (text) =>{
        //validating password
        if(text.trim().length != 0){
            if(text.length >= 4){
                this.setState({
                    forgot_password_valid_color:'green',
                    forgot_password_valid_icon:'check-circle'
                });
                console.log("valid password");
            }else{
                this.setState({
                    forgot_password_valid_color:'red',
                    forgot_password_valid_icon:'close-circle'
                });
            }
        }
    }
    forgotcheckConfirm = (text) =>{
        if(this.state.forgot_password == text){
            this.setState({
                forgot_confirm_valid_icon:'check-circle',
                forgot_confirm_valid_color:'green',
            })
        }else{
            this.setState({
                forgot_confirm_valid_icon:'close-circle',
                forgot_confirm_valid_color:'red',
            })
        }
    }
    submitChangePassword = () =>{
        if(this.state.forgot_password_valid_color == 'red' || this.state.forgot_confirm_valid_color == 'red'){
            alert("Invalid Password");
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
                this.setState({forgot_submitButtonDisable:true});
                var email = this.state.forgot_email.toLowerCase();
                var password = this.state.forgot_password;
                var c_password = this.state.forgot_confirm;
                console.log(":",email,":",password,":",c_password);
                fetch(Global.API_URL+'change_password_MU', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        'email':email,
                        'password':'password',
                        'c_password':'c_password',
                        'user_type':'worker',
                        noti_token:Date()+"",
    
                    })
                }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    if(responseJson.error != undefined){
                        alert("Internal Server error 5004");
                        this.setState({forgot_submitButtonDisable:false});
                        return;
                    }
                    if(responseJson.data.changed == 'yes'){
                        this.setState({forgotModelVisible:false});
                        ToastAndroid.showWithGravityAndOffset(
                            'Password changed sucessfully',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50,
                            ); 
                            this.props.navigation.navigate('LoginScreen');
                        return;
                    }else{
                        alert("Somthing wrong! password Not Changed!!");
                        this.setState({forgot_submitButtonDisable:false});
                    }
                    }).catch((error) => {
                        alert("Internal Server Error 500");
                        console.log("on error featching:"+error);
                        this.setState({forgot_submitButtonDisable:false});
                        this.submitChangePassword();
                });
            }
         });
        

    }
    render() {
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container style={{backgroundColor:'#2268d7'}}>
                    <KeyboardShift>
                        {()=>(
                            <View style={{flex:1,backgroundColor:'#2162ca'}}>
                                <View style={{marginTop:20,height:height*(0.2),flex:3}}>
                                    <View style={{margin:15,flexDirection:'row',justifyContent: 'space-between',}}>
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={{color:'#fff',fontSize:25,fontWeight:'600',alignSelf:'center'}}>GangaCart</Text>
                                            <Image style={{height:30,width:30,alignSelf:'center',marginHorizontal:5}} source={{uri:'https://i.imgur.com/QtXcFQM.png'}}/>
                                        </View>
                                        <TouchableOpacity style={{alignContent:'flex-end',alignItems:'flex-end',alignSelf:'center'}} onPress={this.forgotPasswordStart} >
                                            <Icon name="close" style={{alignSelf:'flex-end',fontSize:30,color:'#fff'}}/>
                                        </TouchableOpacity>    
                                    </View>
                                    <View style={{flexDirection:'row',justifyContent:'space-around',margin:10,marginHorizontal:20,marginVertical:50,alignSelf:'center'}}>
                                        <Text style={{color:"#fff",width:'80%'}}>Keep your password secure</Text>
                                        <Image
                                            style={{width: '20%', height: 50}}
                                            source={{uri: 'https://i.imgur.com/QtXcFQM.png'}}
                                        />
                                    </View>
                                    
                                </View>
                                <View style={{ flex: 7,height: height*(0.8),  width: width,backgroundColor:"#ffffff",flexDirection: 'column', justifyContent: 'center', alignItems: 'center',borderRadius:0.2,borderColor:'#fff'}}>

                                        <View style={{ width: width*(0.85), alignSelf:'center',marginVertical:5}}>
                                            
                                            <Item  regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                <Input 
                                                    placeholder='Email' 
                                                    onChangeText={(text) => {
                                                        this.forgotcheckEmail(text);
                                                        this.setState({forgot_email:text})
                                                        this.forgotcheckAvilEmail(text);
                                                    }}
                                                    textContentType='emailAddress'
                                                    returnKeyType='next'
                                                    keyboardType='email-address'
                                                    editable = {this.state.forgot_email_edit}

                                                />
                                                <Icon name={this.state.forgot_email_valid_icon} style={{color:this.state.forgot_email_valid_color,fontSize:25}}/>
                                            </Item>
                                            { this.state.forgot_email_valid_color == 'red' && 
                                                <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Not a Valid Email Format.</Text>
                                            }
                                            { this.state.forgot_avilEmail && this.state.forgot_email != '' && 
                                                <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Unable to Find Your Account.</Text>
                                            }
                                            { this.state.forgot_email_edit && 
                                                <Button dark block style={{marginVertical:4}} 
                                                        onPress={this.sendOTPForgot}
                                                        disabled={this.state.forgot_sendOTPButtonDisable }
                                                >
                                                        <Text>Send OTP</Text>
                                                </Button>
                                            }  
                                            { this.state.askOTP && 
                                                <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                    <Input 
                                                        placeholder='Enter 6 Digit OTP'
                                                        onChangeText={(text) => {
                                                            this.setState({OTPEntered:text})
                                                            if(text.length == 6 && text != this.state.OTPreal){
                                                                ToastAndroid.showWithGravityAndOffset(
                                                                    'Invalid OTP',
                                                                    ToastAndroid.SHORT,
                                                                    ToastAndroid.TOP,
                                                                    25,
                                                                    50,
                                                                    );    
                                                            }
                                                        }}
                                                        textContentType='password' 
                                                        returnKeyType='next'
                                                        secureTextEntry={true}
                                                        editable = {this.state.forgot_OTP_edit}
                                                    />
                                                </Item>
                                            }
                                            {/* continue password buton after correct OTP */}
                                            { this.state.OTPEntered == this.state.OTPreal && 
                                                <Button dark block style={{marginVertical:4}} onPress={()=>{this.setState({forgot_OTP_edit:false,OTPEntered:'0'})}}>
                                                        <Text>Continue</Text>
                                                </Button>
                                            }  
                                            {/* change password box apper */}
                                            { this.state.forgot_OTP_edit == false && 
                                                <View>
                                                    <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                        <Input 
                                                            placeholder='Password'
                                                            onChangeText={(text) => {
                                                                this.forgotcheckPassword(text);
                                                                this.setState({forgot_password:text})
                                                            }}
                                                            textContentType='password' 
                                                            returnKeyType='next'
                                                            secureTextEntry={true}
                                                        />
                                                        <Icon name={this.state.forgot_password_valid_icon} style={{color:this.state.forgot_password_valid_color,fontSize:25}}/>
                                                    </Item>  
                                                    { this.state.forgot_password_valid_color == 'red' && 
                                                        <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Password Must be at least 4 character Long.</Text>
                                                    }  
                                                    <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                        <Input 
                                                            placeholder='Confirm password'
                                                            onChangeText={(text) => {
                                                                this.forgotcheckConfirm(text);
                                                                this.setState({forgot_confirm:text})
                                                            }}
                                                            textContentType='password' 
                                                            returnKeyType='go'
                                                            onSubmitEditing={this.submitChangePassword}
                                                            secureTextEntry={true}
                                                        />
                                                        <Icon name={this.state.forgot_confirm_valid_icon} style={{color:this.state.forgot_confirm_valid_color,fontSize:25}}/>
                                                    </Item>
                                                    { this.state.forgot_confirm_valid_color == 'red' && 
                                                        <Text style={{color:'red',marginHorizontal:7,fontSize:12}}>*Confirm password Don't Matched.</Text>
                                                    }     
                                                    {
                                                        this.state.forgot_confirm == this.state.forgot_password && this.state.forgot_confirm_valid_color == 'green'  &&
                                                        <Button primary block style={{marginVertical:4}} 
                                                            onPress={this.submitChangePassword}
                                                            disabled={this.state.forgot_submitButtonDisable}>
                                                                <Text>Change Password</Text>
                                                        </Button>
                                                    }            
                                                    
                                                        
                                                </View>
                                                    
                                            }  
                                            
                                        </View>
                                </View>
                            </View>
                        )}
                    </KeyboardShift>
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