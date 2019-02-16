import React from 'react';
import {
            ActivityIndicator,
            AsyncStorage,
            StatusBar,
            StyleSheet,
            TouchableOpacity,
            Image,
            View,
            FlatList,
            ScrollView
        } from 'react-native';
import { PricingCard, Rating } from 'react-native-elements';
import { Container, Header,Button,Content,Card,cardList,Grid,Title, List,Picker, ListItem, Left, Body, Right, Thumbnail, Text, CardItem, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CartPrepare} from '../../constants/OrderListPrepare';

export default class ShopProductDetails extends React.Component
{
    constructor(props){
        super(props)
        this.state={
            pID:0,
            len:0,
            data:[],
            selectedQunt:1,
            selectedShop:'not Selected',
            price:0,
            offer:0,
            info:'',
            title:'',
            topay:0,
            pic:'',
            size:'',
            unit:'',
            selectedProduct:'',
            unit_name:0,
            unitList:[],
            process:true,
        }        
    }

    fetech = async() =>{

        let value = await AsyncStorage.getItem('PID')
        let product = await AsyncStorage.getItem('Product')
        if(value ==null && product==null){
           return; 
        }
        product = JSON.parse(product);
        this.setState({selectedProduct:product});
        console.log("On shop  value :", this.state.selectedProduct);
        await  fetch('http://gomarket.ourgts.com/public/api/gro_product_shop', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
            id:value
            })
            }).then((response) => response.json())
                .then((responseJson) => {
                
                // console.log("Related shop Load ......",responseJson);
            //  this.setState({data:responseJson.data.data}); 
             
            }).catch((error) => {
                    
                //  alert("updated slow network");
                console.log( error.message);
                // log.error({error:err})
                //   value.flag=false;
                //   value.data = "Network request failed" ==error.message?  console.log("Check internet connection"):error;
    
                }); 

    }

    componentWillMount(){
        this.setData();
    }

    setData = async() =>{
        this.setState({process:true});
        const { navigation } = this.props;
        const item = navigation.getParam('data', '[]');
        await this.setState({selectedProduct:item});
        await this.setState({pID:item[0].pid});
        await this.setState({unit:item[0].unit});
        await this.setState({price:item[0].data[0].price});
        await this.setState({offer:item[0].data[0].offer});
        await this.setState({info:item[0].info});
        await this.setState({title:item[0].title});
        await this.setState({pic:item[0].pic});
        await this.setState({size:item[0].size});  
        await this.setState({unit_name:0});
        var len = item[0].data.length;
        await this.setState({len:len});
        let unitList = [];
        if(len > 1){
            for(let index = 0; index < len; index++){
                unitList.push(<Picker.Item label={item[0].data[index].quantity+" "+item[0].data[index].unit} value={index} />);
            }
        }
        await this.setState({unitList:unitList});
        console.log('Data seted successfully.');
        this.setState({process:false});
    }

    unitChange = (indx) =>{

        console.log(this.state.selectedProduct[0],indx);
        console.log(this.state.selectedProduct[0].data[indx],indx);
       // var name = this.state.selectedShop.data[indx].quantity + ' ' + this.state.selectedShop.data[indx].unit;
       const data = this.state.selectedProduct;
        this.setState({unit_name:indx});
        this.setState({
            price:data[0].data[indx].price,
            offer:data[0].data[indx].offer,
            unitname:data[0].data[indx].unit,
        }); 

        console.log(data);
        data[0].size = data[0].data[indx].quantity;
        data[0].unit = data[0].data[indx].unit;
        data[0].offer = data[0].data[indx].offer;
        data[0].price = data[0].data[indx].price;
        this.setState({selectedProduct:data});
    }
   
    _retriveData=async()=>{
        try{
            let pID = await AsyncStorage.getItem('PID');
            let sID = await AsyncStorage.getItem('ShopID');
            if(this.state.pID != pID && this.state.sID != sID){
                this.setState({pID:pID,sID:sID});
                this._inslized();
            }
        }
        catch(error){
            console.log(error)
        }
    }

    /**Render iteam for shop this._selectShop(item)*/
    _renderIteam =({item})=>{
        let uri;
        try {
          item.pic == null ? uri="https://pvsmt99345.i.lithium.com/t5/image/serverpage/image-id/10546i3DAC5A5993C8BC8C?v=1.0":uri= 'http://gangacart.com/public/'+item.pic;  
        } catch (error) {
            uri="https://pvsmt99345.i.lithium.com/t5/image/serverpage/image-id/10546i3DAC5A5993C8BC8C?v=1.0"
        }
        return(
                
              <List>
                <ListItem avatar>
                <Left>
                <Thumbnail large source={{uri: uri}} />
                </Left>
                  <Body>
                  <TouchableOpacity onPress={()=>{this._selectShop(item);}}>
                    <View>
                        <Text>{item.name}</Text>
                        <Text note>Address : {item.address}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View>
                         <Text>Price <Icon name={'currency-inr'} size={15}/> {item.gro_price}</Text>
                        </View>
                        <View >
                         <Text style={{color:"#0b700a"}}>offer : {item.offer}% off</Text>
                        </View>
                        {/* <View>
                        <Text note>Ratting : {item.address}</Text>
                        </View> */}
                    </View>
                    </TouchableOpacity>
                  </Body>
                  
                </ListItem>
              </List>
              
            );
    }

    render(){

        if(!this.state.process){
            console.log('View Called',this.state.len);
            return(
                <Container>
                    <Content>
                        <Card>
                            <CardItem cardBody>
                                <Image
                                    style={{width: '100%', height: 200, resizeMode: 'contain'}}
                                    source= {{uri : 'http://gangacart.com/public/'+this.state.pic}}
                                ></Image>
                            </CardItem>
                            <Grid style={{paddingHorizontal:8,marginVertical:2,flexDirection:'row'}}>
                                <Body>
                                    <Text style={{fontSize:18,fontWeight:'600'}}>{this.state.title} - Local</Text>
                                    <Text style={{fontSize:16,fontWeight:'400'}}>{this.state.info}</Text>
                                </Body>
                            </Grid>
    
                            <CardItem >
                                {(this.state.len > 1) ?
                                    <Picker
                                        style = {{borderColor:'black',borderRadius:10,borderWidth:1}} 
                                        selectedValue={this.state.unit_name}
                                        onValueChange={(itemValue, itemIndex) => {this.unitChange(itemIndex)}}>
                                        {this.state.unitList}
                                    </Picker>
                                    :
                                    <Text style={{fontSize:14,fontWeight:'600',height:30,margin:5}}>{this.state.size+" "+this.state.unit}</Text>
                                }
                            </CardItem>
                            
                            <Grid style={{paddingHorizontal:8,marginVertical:2,flexDirection:'row'}}>
                                <Right>
                                    <Text style={{fontSize:18}}><Icon name="currency-inr" size={18}/>{
                                        (this.state.offer > 0) ?
                                           (this.state.price - (this.state.price)*(this.state.offer/100))
                                            :
                                            (this.state.price) 
                                        }
                                    </Text>
                                </Right>
                                <Body>
                                    <Text style={{fontSize:14,textDecorationLine: 'line-through'}}> MRP <Icon name="currency-inr" size={14}/> {this.state.price}</Text>
                                </Body>                                        
                                <Right>
                                    {(this.state.offer > 0) ?
                                        <Text style={{paddingHorizontal:4 ,color:'#4bb550',fontSize:15}}> {this.state.offer} % off</Text>
                                        :
                                        <Text></Text>
                                    }
                                </Right>
                            </Grid>                    
                            <CardItem footer>
                                <Left> 
                                    <Text style={{color:'#000000'}}><Icon name="currency-inr" size={18}/>{this.state.price * this.state.selectedQunt}</Text>
                                </Left>
                                <Right>
                                    <View style={{flexDirection:'row'}}>          
                                        <Button  onPress={()=>{let qunt=this.state.selectedQunt-1; qunt>1?'':qunt=1; this.setState({selectedQunt:qunt})}}>
                                            <Text style={{color:'#ffffff',fontSize:'900',fontSize:25}}>   -   </Text>
                                        </Button>
                                        <View style={{borderWidth:1,width:50,alignItems:'center'}}>
                                            <Title style={{color:'#000000'}}>{this.state.selectedQunt}</Title>
                                        </View>                        
                                        <Button  onPress={()=>{let qunt=this.state.selectedQunt+1;this.setState({selectedQunt:qunt})}}>
                                            <Text style={{color:'#ffffff',fontSize:'900',fontSize:25}}>   +   </Text>
                                        </Button>                          
                                    </View>
                                </Right>
                            </CardItem>
                        </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                    <Button bordered onPress={()=>{CartPrepare(this.state.selectedProduct,this.state.selectedQunt);}}>
                                        <Text>ADD TO BASKET</Text>
                                    </Button>
                                </Body>
                            </CardItem>
                        </Card>
                    </Content>
                </Container>
            )
        }else{
            console.log('Spinner');
            return(<View style={{justifyContent:'center'}}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>);

            // return(
            //     <View style={{flex:1,justifyContent:'space-between'}}>
            //         <ScrollView>
            //             <View 
            //                 style={{ 
            //                         backgroundColor:'#fffcfc', 
            //                         padding:5,
            //                         borderBottomWidth:0.5,
            //                         borderBottomColor:'#b4b5b3'
            //                 }}
            //             >
            //                 <View style={{ height:300,flexDirection:'row'}}>
                            
            //                 <View style={{paddingHorizontal:5,width: '100%', height:300,}}>
            //                     <Image style={{width: '100%', height: 300, resizeMode: 'contain',}} source={{uri:pic}}/> 
            //                 </View>
            //                 </View> 
            //                 <View style={{alignItems:'center',justifyContent:'center',padding:3,margin:5,flexDirection:'row'}}>
            //                     <Text style={{fontSize:18}}>{name}</Text>
            //                 </View>
        
            //                 <View style={{alignItems:'center',justifyContent:'center',padding:3,margin:5,flexDirection:'row'}}>
            //                     <Text style={{fontSize:18}}>{itemId}</Text>
            //                 </View>
        
            //                 <View style={{alignItems:'center',justifyContent:'center',padding:3,margin:5,flexDirection:'row'}}>
            //                     <Text style={{fontSize:12,fontWeight:'500',color:'#bbc0c9'}}>{info}</Text>
            //                 </View>
                    
            //             </View>
                    
            //         <View style={{ backgroundColor:'#fffcfc', 
            //                                         padding:5,
            //                                         borderBottomWidth:0.5,
            //                                         borderBottomColor:'#b4b5b3'}}>
            //                 <View style={{flexDirection:'row'}}>          
            //                     <Text>Quntity :  </Text>
            //                     <Text style={{color:'#0b700a'}}>{this.state.selectedQunt} {unitname}</Text>
            //                     <View style={{paddingHorizontal:10}}></View>
            //                     <Button title="   -   " onPress={()=>{let qunt=this.state.selectedQunt-1; qunt>1?'':qunt=1; this.setState({selectedQunt:qunt})}}/>
            //                     <View style={{borderWidth:1,width:50,alignItems:'center'}}><Text>{this.state.selectedQunt}</Text></View>                        
            //                     <Button title="   +   " onPress={()=>{let qunt=this.state.selectedQunt+1;this.setState({selectedQunt:qunt})}}/>
                        
            //                 </View>
                        
                    
            //         </View>
        
            //         <View style={{ backgroundColor:'#fffcfc', 
            //                                         marginTop:5,
            //                                         padding:5,
            //                                         borderBottomWidth:0.5,
            //                                         borderBottomColor:'#b4b5b3'}}>
            //                 <View>          
            //                     <Text style={{color:'#000cfc',alignSelf:'center',fontSize:15}}>Related Product </Text>
            //                 </View>
            //             <FlatList
            //                     horizontal
            //                     data={this.state.data}
            //                     renderItem={this._renderIteam}
                            
            //                     keyExtractor={item => item.gro_shop_info_id.toString()}
            //                     ListEmptyComponent={()=>{
            //                         if(this.state.isEmpty =='Wait List is Loading.....')
            //                             return(<View style={{justifyContent:'center'}}>
            //                                 <ActivityIndicator size="large" color="#0000ff" />
            //                                 <Text>{this.state.isEmpty}</Text>
        
            //                             </View>);
            //                         else
            //                         return(<View style={{justifyContent:'center'}}>
            //                                 <Text>{this.state.isEmpty}</Text>
        
            //                                 </View>)}}
        
            //                     ListFooterComponent={()=>{if(this.state.loading) return <View style={{height:20}}><ActivityIndicator size="large" color="#0000ff" /></View>
            //                     else return <View></View>}}              
            //             />   
            //         </View>
        
            //         </ScrollView>
                
            //         <View style={{height:50,backgroundColor:'#ede32d',flexDirection:'row',justifyContent:'space-around'}}>              
            //                     <View style={{padding:5}}>
            //                         <View style={{flexDirection:'row'}}>
            //                             <Text style={{}}>Price :<Icon name={'currency-inr'} size={15}/> {this.state.selectedProduct.gro_price*this.state.selectedQunt} </Text>
            //                             {/* <Text style={{color:'#18ce21'}}>$ {this.state.topay}</Text> */}
            //                         </View>
            //                     </View>
            //             <View style={{padding:5}}><Button title=" ADD TO BASKET " color="#ce2418" onPress={()=>{CartPrepare(this.state.selectedProduct,this.state.selectedQunt);}}/></View>
            //         </View>
            //     </View>
            // )
        }
    
        
     
    }
}