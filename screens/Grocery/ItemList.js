import React, { Component } from "react";
import {
    StyleSheet,WebView ,View,TouchableOpacity,Dimensions,AsyncStorage,
    ToastAndroid,NetInfo,Modal,FlatList,ScrollView,Image,Button
} from "react-native";
import { 
    Container,Spinner,Text,Content,Header,Grid,
    Left,Right,Title,Body,Input,Card,CardItem,List,ListItem,Form,Picker,Item,
    Textarea,Label,Thumbnail,
} from 'native-base';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
const {width,height} = Dimensions.get('window');
import Global from  '../../constants/Global';
import {CartPrepare} from '../../constants/OrderListPrepare';

export default class ItemList extends Component {
    constructor(props){
        super(props);
        const {navigation} = this.props;
        let val = navigation.getParam('sid',5);
        this.state = {
            ProductList:[],
            renderCoponentFlag: false,
            LodingModal: false,
            value:val,
            data:[],
        }
    }


    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
        this.fatchItem();
    }

    fatchItem =async ()=> {
        
        var connectionInfoLocal = '';
        NetInfo.getConnectionInfo().then((connectionInfo) => {
     //   console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
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
            this.setState({renderCoponentFlag:false});
            fetch(Global.API_URL+'gro_product', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    id:this.state.value
                })
            }).then((response) => response.json())
            .then((responseJson) => {
               // console.log(responseJson); 
                if(responseJson.received == "yes"){

                    let list = [];
                    var map_id = 0;
                    let index=0;
                    for(let data of responseJson.data.data){
                        if(data.map != map_id){
                            map_id = data.map;
                            let element = {
                                checked:true,
                                index:index++,
                                quantity:1,
                                info:data.info,
                                map:data.map,
                                mapcid:data.mapcid,
                                pic:data.pic,
                                pid:data.pid,
                                price:data.price,
                                size:data.size,
                                stock:data.stock,
                                title:data.title,
                                unit:data.unit
                            };
                            list.push(element);
                        }   
                        else{
                            map_id = data.map;
                        }
                    }
                    this.setState({ProductList:list,data:list,renderCoponentFlag:true});
                   // console.log(responseJson.data.data);
                    console.log("Fstch Dsta printed");
                }
                }).catch((error) => {
                    console.log("on error featching:"+error);
            });
        }
        });
        console.log(connectionInfoLocal);  
    }

    _addQuantity=(index) =>{
        const {ProductList} = this.state;
        ProductList[parseInt(index)].quantity = ProductList[index].quantity +1;
        console.log("Addd");
        this.setState({
            ProductList
        });
        CartPrepare(ProductList[parseInt(index)],ProductList[parseInt(index)].quantity);
    }

 
    _subQuantity=(index) =>{
        const {ProductList} = this.state;
        ProductList[parseInt(index)].quantity = ProductList[index].quantity > 1? ProductList[index].quantity-1 :ProductList[index].quantity;
        console.log("sub");
        this.setState({
            ProductList
        });
        CartPrepare(ProductList[parseInt(index)],ProductList[parseInt(index)].quantity);
    }

    _toggleCheckbox =(index) =>{
        console.log("Index value ",index);
        let checkboxes = this.state.ProductList;
        checkboxes[parseInt(index)].checked = !checkboxes[index].checked;
        this.setState({ProductList:checkboxes});
        CartPrepare(checkboxes[parseInt(index)],checkboxes[parseInt(index)].quantity);
        console.log(this.state.ProductList[index].checked);
    }

    _renderIteam = ({item}) => {
         console.log('data ',item);
        var uri;
         try {
             item.pic.length == 0 ? uri="https://pvsmt99345.i.lithium.com/t5/image/serverpage/image-id/10546i3DAC5A5993C8BC8C?v=1.0":uri="http://gomarket.ourgts.com/public/"+item.pic;  
         } catch (error) {
             uri="https://pvsmt99345.i.lithium.com/t5/image/serverpage/image-id/10546i3DAC5A5993C8BC8C?v=1.0"
         }

         //  console.log(uri);
         
         return(    
                 <View style={{ flex:1,
                                 backgroundColor:'#fcfcfc', 
                                 padding:5,
                                 flexDirection:"row",
                                 height:150, 
                                 borderWidth:0.5,
                                 borderColor:'#cecece'
                                 }}>

                     <TouchableOpacity onPress={() => {  this.props.navigation.navigate('ItemDetails',{
                         data:[item]
                     })}}>
                         <View style={{padding:5,width:100, height: 160,borderRadius:5}}>
                             <Image style={{width:100, height: 150,borderRadius:5,resizeMode: 'contain',}} source={{uri:uri}}/>
                         </View>
                     </TouchableOpacity>
                     
                     <View style={{flex:1,paddingLeft:10}}>
                         
                         <Text style={{fontSize:14,fontWeight:'900'}}>{item.title}</Text>
                         <Text style={{fontSize:14,fontWeight:'400'}}>{item.info} </Text>
                         <Text style={{fontSize:14,fontWeight:'600',height:25,margin:5}}>{item.size+" "+item.unit}</Text>
                         
                         <View style={{flexDirection:'row',justifyContent:'space-around',padding:5,height:50,paddingBottom:5}}>
                             <View style={{flexDirection:'column',paddingBottom:5}}>
                                 <Text style={{fontSize:16,fontWeight:'900'}}><Icon name={'currency-inr'} size={15}/>{item.price}</Text>
                             </View>

                             {(!this.state.ProductList[item.index].checked) ?  
                                 <View style={{borderWidth:1,height:50,flexDirection:'row',paddingBottom:5}}>
                                     <Button title=' - '  onPress={this._subQuantity.bind(this,item.index)}/>
                                     <View style={{width:50,height:50,paddingBottom:5}}>
                                         <Text style={{fontSize:20,alignSelf:'center'}}>{item.quantity}</Text>
                                     </View>
                                     <Button title=' + ' onPress={this._addQuantity.bind(this,item.index)}/>
                                 </View>
                             :
                                 <View style={{justifyContent:'space-around',padding:5,height:50,paddingBottom:5,alignSelf:'flex-end'}}>
                                     <Button title= {"Add +"}   onPress={this._toggleCheckbox.bind(this, item.index)}/>
                                 </View>
                             }
                         </View>   
                     </View>
             </View>              
         );
     }


    render() {        
       
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <View style={{flex:1,width:'100%'}}>
                    <ScrollView>  
                        <FlatList
                            extraData = {this.state}
                                data = {this.state.ProductList}
                            renderItem = {this._renderIteam}
                            numColumns={1}
                            keyExtractor = {item => item.index.toString()}     
                        />   
                    </ScrollView>      
                </View>
                
            );
        }else{
            return (
                <Spinner color='#2874f0' size='large' style={{height:40}} />
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