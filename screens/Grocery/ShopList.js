import React from 'react';
import {ActivityIndicator,AsyncStorage,ToastAndroid,StyleSheet,
        TouchableOpacity,Image,View,FlatList,ScrollView,NetInfo
        } from 'react-native';
import { SearchBar } from 'react-native-elements'
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import Global from  '../../constants/Global';

export default class ShopList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            data:[],//store data of category items
            process:false,
            obj:this.props,
            serachText:"",
            fullData:'',
            isEmpty:'',
        }
    }
    componentDidMount(){  
        this.fetech();
    }

    fetech = async() =>{    
        this.setState({process:true});
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
                
                fetch(Global.API_URL+'Grocery/Shop/List', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    }).then((response) => response.json())
                        .then((responseJson) => {  
                        console.log("Shop List Load ......",responseJson);
                        if(Object.keys(responseJson.data.data).length > 0) {
                            this.setState({data:responseJson.data.data,
                                fullData:responseJson.data.data
                            });
                        }
                        else{
                            this.setState({isEmpty:'No Data Found'});
                        }
                    }).catch((error) => {    
                        console.log( error.message);
                }); 
            }
        });
        this.setState({process:false});
        console.log(connectionInfoLocal);
    }
    _storeData=async(sID) =>{
        try{
            await AsyncStorage.setItem('ShopID',JSON.stringify(sID))
            this.props.navigation.navigate('CategoryList');
        }
        catch(error){
            console.log("Eroor he Product list me ",error);
        }
    }


    _renderIteam=({item})=>{    
        let uri;
        try {
          (item.pic == null ||item.pic.length == 0) ? uri="https://pvsmt99345.i.lithium.com/t5/image/serverpage/image-id/10546i3DAC5A5993C8BC8C?v=1.0":uri=item.pic;  
        } catch (error) {
            uri="https://pvsmt99345.i.lithium.com/t5/image/serverpage/image-id/10546i3DAC5A5993C8BC8C?v=1.0"
        }
        return(
              <List style={{backgroundColor:'#f9f9f9'}}>
                <ListItem avatar>
                    <Left>
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ShopDetail',{item:item});}}>
                            <Thumbnail large source={{uri: uri}} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{backgroundColor:"#f9f9f9"}}>
                        <TouchableOpacity onPress={()=>{this._storeData(item.gro_shop_info_id);}}>
                            <View>
                                <Text>{item.name}</Text>
                                <Text note>Address : {item.address}</Text>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                
                                {/* <View>
                                <Text note>Ratting : {item.address}</Text>
                                </View> */}
                            </View>
                        </TouchableOpacity>
                    </Body>
                    <Right>
                        <Text style={{
                                fontWeight:'500',
                                fontSize:15,
                                backgroundColor:'#ffa329',
                                color:'white',
                                borderRadius:5,
                                paddingHorizontal:5
                            }}>
                                {(item.rating ) ? (item.rating+'*') : 0+'*'}
                        </Text>
                    </Right>
                </ListItem>
              </List>
            );
    }   

    _onChangeText=(text) =>{
        this.setState({serachText:text});
        try {
             const newData = this.state.fullData.filter(item => {      
                const itemData = `${item.name.toUpperCase()}`;
                 const textData = text.toUpperCase();
                 return itemData.indexOf(textData) > -1;    
              });    
              this.setState({data: newData });
            if(newData.length == 0){
                this.setState({isEmpty:'No Data Found'});
            }  
            else{
                this.setState({isEmpty:''});
            }
        } catch (error) {
             console.log(error)
        }
    }
    
    render(){    
        return(
            <View style={{width:'100%',flex:1,padding:10,}}>
                <SearchBar
                    round
                    value = {this.state.serachText}
                    onChangeText={this._onChangeText}
                    placeholder='Type Here...' 
                />
                <ScrollView>                   
                    <FlatList
                        data={this.state.data}
                        renderItem={this._renderIteam}
                        keyExtractor={item => item.gro_shop_info_id.toString()}
                        ListEmptyComponent={()=>{
                            if(this.state.isEmpty)
                                return( 
                                    <View style={{justifyContent:'center'}}>
                                        <Text>No Record Found</Text>
                                    </View>
                                );
                            else
                                return( 
                                    <View style={{justifyContent:'center'}}>
                                        <ActivityIndicator size="large" color="#0000ff" />
                                        <Text>Wait List is Loading.....</Text>
                                    </View>
                                );
                        }}  
                    />
                </ScrollView>
            </View>
        );
    }
}