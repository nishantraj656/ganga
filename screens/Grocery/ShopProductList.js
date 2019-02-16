import React from 'react';

import {
            ActivityIndicator,
            AsyncStorage,
            Button,
            StatusBar,
            StyleSheet,
            TouchableOpacity,
            Image,
            View,
            Text,
            FlatList,
            ScrollView,
            Modal,
            TouchableHighlight,
            Alert,
            Picker,
            NetInfo,
            ToastAndroid
        } from 'react-native';


import Global from  '../../constants/Global';
import {CartPrepare} from '../../constants/OrderListPrepare';
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



export default class ShopsProductsList extends React.Component
{
    constructor(props){
        super(props);
        const {navigation} = this.props;
        let val = navigation.getParam('sid',5);
        this.state={
            data:[],//store data of sub-category items
            process:false,
            isEmpty:'Wait List is Loading.....',
            serachText:"",
            fullData:'',
            Qun:1,
            weight:'0',
            start:0,
            sid:val,
            loading:true,
            isData:true,
            imgPath:'http://gangacart.com/public/',
            checkboxes:[],   
        }
    }

    componentDidMount(){
       this.fetech();
    }

    fetech = async() =>{
        let value = await AsyncStorage.getItem('ShopID')
        let id = this.state.sid;
        if(value ==null && id == null){
            return; 
        }

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
                console.log(Global.API_URL);
                fetch(Global.API_URL+'Grocery/Shop/productList', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        Shopid:value,
                        id:id
                    })
                    }).then((response) => response.json())
                        .then((responseJson) => {  
                        //console.log("Shop List Load ......",responseJson);
                        if(Object.keys(responseJson.data).length > 0) {
                            this.setState({
                                data:responseJson.data,
                                isEmpty:"List is empty...",
                                loading:false,
                                fullData:responseJson.data
                            });
                            this._addCheckbox();
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


    _addCheckbox() {
        let array =this.state.data;
        let index=0;
        let list = [];
        var temp_map_id = 0;
        var listArray = [];
        var content = [];
        var last = array[array.length-1]["psid"];
        array.forEach(element =>
        {  
            console.log(element["mid"] ,' ',index, ' ', last,' ',element["psid"]);
            if(element["mid"] == temp_map_id){
                temp_map_id = element["mid"];

                var temp = {
                    offer:element["offer"],
                    price:element["price"],
                    quantity:element["quantity"],
                    inStock:element["stock"],
                    unit:element["unit_name"]
                };
                content.push(temp);

                if(last == element["psid"])
                {
                    this.listArray['data'] = content;
                    list.push(this.listArray);
                }
            }
            else{

                if(temp_map_id != 0){
                    
                    this.listArray['data'] = content;
                    list.push(this.listArray);

                  //  console.log(this.listArray);
                    content = [];
                    this.listArray = [];
                    var arrayData = {
                        checked : true,
                        index : index++,
                        quntity : 1,
                        offer:element["offer"],
                        mapcid : element["cid"],
                        map : element["mid"],
                        pic : element["pic"],
                        info : element["pinfo"],
                        pid : element["plid"],
                        title : element["name"],
                        price : element["price"],
                        size : element["quantity"],
                        stock : element["stock"],
                        unit : element["unit_name"],
                    }

                    this.listArray = arrayData;                    

                    var temp = {
                        price:element["price"],
                        offer:element["offer"],
                        quantity:element["quantity"],
                        inStock:element["stock"],
                        unit:element["unit_name"]
                    };

                    content.push(temp);
                    if(last == element["psid"])
                    {
                        this.listArray['data'] = content;
                        list.push(this.listArray);
                    }
                }
                else{
                    var arrayData = {
                        checked : true,
                        index : index++,
                        quntity : 1,
                        offer:element["offer"],
                        mapcid : element["cid"],
                        map : element["mid"],
                        pic : element["pic"],
                        info : element["pinfo"],
                        pid : element["plid"],
                        title : element["name"],
                        price : element["price"],
                        size : element["quantity"],
                        stock : element["stock"],
                        unit : element["unit_name"],
                    }
                    this.listArray = arrayData; 
                    var temp = {
                        offer:element["offer"],
                        price:element["price"],
                        quantity:element["quantity"],
                        inStock:element["stock"],
                        unit:element["unit_name"]
                    };
                    content.push(temp);
                }
                temp_map_id = element["mid"];
            }
        });
        //console.log(list);
        this.setState({checkboxes:list})
        this.setState({fullData:list})
    }

    _addQuantity=(index) =>{
        const {checkboxes} = this.state;
        checkboxes[parseInt(index)].quntity = checkboxes[index].quntity +1;
        console.log("Addd");
        this.setState({
            checkboxes
        });
        CartPrepare(checkboxes[parseInt(index)],checkboxes[parseInt(index)].quntity);
    }

 
    _subQuantity=(index) =>{
        const {checkboxes} = this.state;
        checkboxes[parseInt(index)].quntity = checkboxes[index].quntity > 1? checkboxes[index].quntity-1 :checkboxes[index].quntity;
        console.log("sub");
        this.setState({
            checkboxes
        });
        CartPrepare(checkboxes[parseInt(index)],checkboxes[parseInt(index)].quntity);
    }

    _toggleCheckbox =(index) =>{
        console.log("Index value ",index);
         let checkboxes = this.state.fullData;
         checkboxes[parseInt(index)].checked = !checkboxes[index].checked;
         this.setState({fullData:checkboxes});
         CartPrepare(checkboxes[parseInt(index)],checkboxes[parseInt(index)].quntity);
         console.log(checkboxes[index]);
    }

changeQuantity = (index,dindex) =>{
    let data =  this.state.fullData;
    data[index].size = data[index].data[dindex].quantity;
    data[index].price = data[index].data[dindex].price;
    data[index].unit =  data[index].data[dindex].unit;
    data[index].offer = data[index].data[dindex].offer;
    this.setState({fullData:data}); 
    console.log(data[index]);
}

_renderIteam=({item})=>{

    let pName = item.title;
    let unit = item.unit;
    let price = item.price;
    let uri;
    //let Qun = this.size;
    let len = item.data.length;
    let PickerItem = [];
    
    for(let data of item.data){
        PickerItem.push(<Picker.Item label={data.quantity+" "+data.unit} value={data.quantity+" "+data.unit} />)
        //console.log(item.size + ' ' + data.quantity);
    }

    try {
      item.pic.length == 0 ? uri="https://pvsmt99345.i.lithium.com/t5/image/serverpage/image-id/10546i3DAC5A5993C8BC8C?v=1.0":uri=this.state.imgPath+item.pic;  
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

                <TouchableOpacity onPress={()=>{this._storeData(this.props,item)}}>
                    <View style={{padding:5,width:100, height: 160,borderRadius:5}}>
                        <Image style={{width:100, height: 150,borderRadius:5,resizeMode: 'contain',}} source={{uri:uri}}/>
                    </View>
                </TouchableOpacity>
                
                <View style={{flex:1,paddingLeft:10}}>
                    
                    <Text style={{fontSize:14,fontWeight:'900'}}>{pName}</Text>
                    <Text style={{fontSize:14,fontWeight:'400'}}>{item.info} </Text>
                    {/* <View style={{justifyContent:'space-around',flexDirection:'row'}}>
                        <Text style={{fontSize:15,fontWeight:'900',paddingHorizontal:7,color:'#fcfcfc',backgroundColor:'#02490b'}}>*3.5</Text>
                        <Text style={{fontSize:15,fontWeight:'400',paddingHorizontal:7,color:'#878787',}}>Rating 1,657</Text>
                    </View> */}
                    {(len > 1) ?
                        <View style={{borderWidth:1,margin:5}}> 
                            <Picker
                                selectedValue={item.size+" "+unit}
                                onValueChange={(itemValue, itemIndex) => {this.changeQuantity(item.index,itemIndex)}}>
                                {PickerItem}
                            </Picker>
                        </View>
                        :
                        <Text style={{fontSize:14,fontWeight:'600',height:30,margin:5}}>{item.size+" "+unit}</Text>
                    }
                    
                    <View style={{flexDirection:'row',justifyContent:'space-around',padding:5,height:50,paddingBottom:5}}>
                        <View style={{flexDirection:'column',paddingBottom:5}}>
                            <Text style={{fontSize:16,fontWeight:'900'}}><Icon name={'currency-inr'} size={15}/>{
                                (item.offer > 0 ) ? 
                                  (price - (price)*(item.offer/100))

                                    :
                                    price
                                }
                                {
                                    (item.offer > 0 ) ? 
                                        <Text style={{fontSize:12,textDecorationLine: 'line-through'}}>  MRP <Icon name="currency-inr" size={12}/>{price}</Text>
                                    :
                                    <Text></Text>
                                }
                                </Text>
                            {(item.offer > 0.1) ?
                                <Text style={{fontSize:14,fontWeight:'500',color:'green'}}>{item.offer}% off</Text>
                                :
                                <Text></Text>
                            }
                        </View>

                        {item.checked ?
                            <View style={{flexDirection:'row',justifyContent:'space-around',padding:5,height:50,paddingBottom:5,alignSelf:'flex-end'}}>
                                <Button title="Add+" onPress={this._toggleCheckbox.bind(this, item.index)}/>
                            </View>
                        :
                            <View style={{borderWidth:1,height:50,flexDirection:'row',paddingBottom:5}}>
                            <Button title=' - '  onPress={this._subQuantity.bind(this,item.index)}/>
                            <TouchableOpacity onPress={()=>{}}>
                            <View style={{width:50,height:50,paddingBottom:5}}><Text style={{fontSize:20,alignSelf:'center'}}>{item.Quantity}</Text></View>
                            </TouchableOpacity>
                            <Button title=' + ' onPress={this._addQuantity.bind(this,item.index)}/>
                            </View>
                        }
                    </View>   
                </View>
        </View>              
    );
} 


/**end */
   
    _storeData=async( nvg,item) =>{
        console.log("Eroor he Product list me ",item);
        try{
            
            //await AsyncStorage.setItem('PID',JSON.stringify(item.gro_product_list_id));
            //await AsyncStorage.setItem('Product',JSON.stringify(item));
            nvg.navigation.navigate('ShopProductDetails',{
                data : [item],

            });
        }
        catch(error){
            console.log("Eroor he Product list me ",error);
        }
    }

_onChangeText=(text) =>{
    this.setState({serachText:text});
    try {
             const newData = this.state.fullData.filter(item => {      
                const itemData = `${item.title.toUpperCase()}`;
                 const textData = text.toUpperCase();
                 return itemData.indexOf(textData) > -1;    
              });    
              this.setState({checkboxes: newData });
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
        
        //this._retrieveData();
        // console.log("From state  ",this.state.data);
        return(
            <View style={{flex:1,width:'100%'}}>
                <SearchBar
                    round
                    value = {this.state.serachText}
                    onChangeText={this._onChangeText}
                    placeholder='Type Here...' 
                />
                <ScrollView>  
                    <FlatList
                            data={this.state.checkboxes}
                            renderItem={this._renderIteam}
                            numColumns={1}
                            keyExtractor={item => item.index.toString()}
                            ListEmptyComponent={()=>{
                                if(this.state.isEmpty =='Wait List is Loading.....')
                                    return(<View style={{justifyContent:'center'}}>
                                        <ActivityIndicator size="large" color="#0000ff" />
                                        <Text>{this.state.isEmpty}</Text>

                                    </View>);
                                else
                                    return(<View style={{justifyContent:'center'}}>
                                            <Text>{this.state.isEmpty}</Text>
                                        </View>)}}          
                    />   
            </ScrollView>      
        </View>
        )
    }
}