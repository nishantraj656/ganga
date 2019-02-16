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
    BackHandler,
    Alert

} from "react-native";
import { Container, Spinner, Button,Text, Item,Input,CheckBox,Body, Content} from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import { } from 'react-native-elements'

import Global from '../../constants/Global';
import { ScrollView } from "react-native-gesture-handler";
import KeyboardShift from "../../components/KeyboardShift";
const {height,width} = Dimensions.get('window');
export default class LoginScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            loginModelVisible:false,
            signUpModelVisible:false,
            forgotModelVisible:false,
            submitButtonDisable:false,
            forgot_submitButtonDisable:false,
            email_or_phone:"",
            password:"",  
            backPress:0,
        }
    }
    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    // handleBackButton() {
    //     
    // }
    handleBackButton = () => {
        if(this.state.backPress == 0 ){
            ToastAndroid.show('Press Again to Exit App', ToastAndroid.SHORT);
            this.setState({
                backPress:1,
            })
            return true;
        }
        Alert.alert(
            'Exit App',
            'Exiting the application?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => BackHandler.exitApp()
            }, ], {
                cancelable: false
            }
         )
         return true;
       } 
    // handle login 
    // _retrieveData = async () => {
    //     try {
    //       //await AsyncStorage.setItem('key_login_status_market_g', 'false');

    //         const value = await AsyncStorage.getItem('key_login_status_market_g');
    //         if (value !== null) {
    //             if(value == 'true'){
    //                 this.setState({
    //                     login_status: true
    //                 });
    //             }
                
    //         }
    //     } catch (error) {
    //         this.setState({
    //             login_status: false
    //         });
    //      }
    //   }
    // _storeData = async (user_email,user_phone,user_name,user_state,user_city,user_landmark,user_address) => {
    //     try {
    //       await AsyncStorage.setItem('key_login_status_market_g', 'true');
    //       await AsyncStorage.setItem('user_email',user_email );
    //       await AsyncStorage.setItem('user_phone',user_phone );
    //       await AsyncStorage.setItem('user_name',user_name );
    //       await AsyncStorage.setItem('user_state',user_state);
    //       await AsyncStorage.setItem('user_city',user_city );
    //       await AsyncStorage.setItem('user_landmark',user_landmark );
    //       await AsyncStorage.setItem('user_address',user_address );


    //       let email = await AsyncStorage.getItem('user_email');
    //       let phone = await AsyncStorage.getItem('user_phone');
    //       let name = await AsyncStorage.getItem('user_name');
    //       let state = await AsyncStorage.getItem('user_state');
    //       let city = await AsyncStorage.getItem('user_city');
    //       let landmark = await AsyncStorage.getItem('user_landmark');
    //       let address = await AsyncStorage.getItem('user_address');
    //       console.log("in llogin retriving data ",email,phone,name,state,city,landmark,address);
    //         console.log("saved in login");
    //     }catch (error) {
    //         console.log("Eroor in saving");
    //     }
    // }
    submitLogin = () =>{


        if(this.state.email_or_phone.trim().length == 0 || this.state.password.length == 0 ){
            alert("Enter Email and Password first")
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
            this.setState({submitButtonDisable:true});
            var username = this.state.email_or_phone.toLowerCase();
            var password = this.state.password;
            console.log(username+":"+password);
            fetch(Global.API_URL+'login_MU', {
                method: 'POST',
                headers: {
                    
                },
                body: JSON.stringify({
                    name:'Your Name',
                    email:username,
                    password:password,
                    user_type:'user',
                    noti_token:Date()+"",
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if(responseJson.error != undefined){
                    if(responseJson.error== "Unauthorised"){
                        this.setState({submitButtonDisable:false});
                        alert("Invalid Email or password");
                        return;
                    }
                    alert("Internal Server error 5004");
                    
                    this.setState({submitButtonDisable:false});
                    return;
                }
                var itemsToSet = responseJson.success.token; 
                var profileData = responseJson.profileData;
                var userID = responseJson.userID;
                console.log("userid",userID);
                console.log(profileData);
                if(responseJson.status == 'valid'){
                    if(itemsToSet.length != 0 ){
                        this._signInAsync(itemsToSet,JSON.stringify(profileData),userID);
                        return;
                    }    
                }else{
                    this.setState({submitButtonDisable:false});
                    alert("Invalid Email or Password");
                }
                
                    console.log("resp:",itemsToSet);
                }).catch((error) => {
                    alert("Internal Server Error 500");
                    console.log("on error featching:"+error);
                    this.setState({submitButtonDisable:false});
            });
        }
        });
        console.log(connectionInfoLocal);
    }
    _signInAsync = async (token,profileData,userID) => {
        userID = userID + "";//converting to string
        console.log("setting token");
        await AsyncStorage.setItem('Token', token);
        console.log("setting user data");
        await AsyncStorage.setItem('userID', userID);

        await AsyncStorage.setItem('userProfileData', profileData);
        console.log("sending to back");
        this.props.navigation.goBack(null);
        console.log("sent to app");
    };
    saveNotificationToken = () => {
        console.log("noti");
    }
    

    render() {
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container style={{backgroundColor:'#2268d7'}}>
                    <KeyboardShift>
                    {() => (
                        <View style={{flex:1,backgroundColor:'#2162ca'}}>
                                <View style={{marginTop:15,height:height*(0.4),flex:4}}>
                                    <View style={{margin:10,flexDirection:'row',justifyContent: 'space-between',}}>
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={{color:'#fff',fontSize:25,fontWeight:'600',alignSelf:'center'}}>GangaCart</Text>
                                            <Image style={{height:30,width:30,alignSelf:'center',marginHorizontal:5}} source={{uri:'https://i.imgur.com/QtXcFQM.png'}}/>
                                        </View>
                                        <TouchableOpacity style={{alignContent:'flex-end',alignItems:'flex-end',alignSelf:'center'}} onPress={()=>{}} >
                                            <Icon name="close" style={{alignSelf:'flex-end',fontSize:30,color:'#fff'}}/>
                                        </TouchableOpacity>    
                                    </View>
                                    <View style={{flexDirection:'row',justifyContent:'space-around',margin:10,marginHorizontal:20,marginVertical:50,alignSelf:'center'}}>
                                        <Text style={{color:"#fff",width:'80%'}}>Sign in to make a monthly expence report and get more spiecal offer and awards</Text>
                                        <Image
                                            style={{width: '20%', height: 50}}
                                            source={{uri: 'https://i.imgur.com/QtXcFQM.png'}}
                                        />
                                    </View>
                                    
                                </View>
                                <View style={{ flex: 6,height: height*(0.6),  width: width,backgroundColor:"#ffffff",flexDirection: 'column', justifyContent: 'center', alignItems: 'center',borderRadius:0.2,borderColor:'#fff'}}>

                                        <View style={{ width: width*(0.85), alignSelf:'center',marginVertical:5}}>
                                            <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                <Input 
                                                    placeholder='Email' 
                                                    onChangeText={(text) => this.setState({email_or_phone:text})}
                                                    textContentType='username'
                                                />
                                            </Item>
                                            <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                                                <Input 
                                                    placeholder='Password'
                                                    onChangeText={(text) => this.setState({password:text})} 
                                                    secureTextEntry={true}
                                                    textContentType='password'
                                                    
                                                 />
                                            </Item>
                                            <TouchableOpacity style={{marginVertical:5}} onPress={()=>{
                                                    this.props.navigation.navigate('ForgotScreen');
                                                }}>
                                                <Text style={{alignSelf:'flex-end',color:'#2162ca'}}>Forgot Password?</Text>
                                            </TouchableOpacity>                  
                                            <Button block 
                                                style={{color:'#fff',backgroundColor:'#fb641b',marginVertical:5}}
                                                onPress={this.submitLogin}
                                                disabled = {this.state.submitButtonDisable}
                                            >
                                                <Text>SIGN IN</Text>
                                            </Button>
                                            <Button block bordered primary   
                                                style={{marginVertical:5}}
                                                onPress={()=>{
                                                    this.props.navigation.navigate('SingupScreen');
                                                }}
                                                
                                            >
                                                <Text>New to Flipcart? SIGNUP </Text>
                                            </Button>
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