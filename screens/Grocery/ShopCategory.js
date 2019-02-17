import React, { Component } from "react";
import {
    StyleSheet,WebView,View,TouchableOpacity,FlatList,
    Dimensions,AsyncStorage,ToastAndroid,NetInfo,Modal,
} from "react-native";
import { 
    Container,Spinner,Button,
    Text,Content,Header,Left,Right,Title,Body,Input,Card,CardItem,List,ListItem,Form,
    Picker,Item,Textarea,Label,Accordion,Thumbnail,
} from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from "../../constants/Global";
const {width,height} = Dimensions.get('window');

export default class Category extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            LodingModal: false,
            CategoryData: [],
        }
    }

    fatchCategory =async ()=> {
        
        this.setState({renderCoponentFlag:false});
        // let value = await AsyncStorage.getItem('ShopID');
        // if(value ==null){
        //     alert('Shop not selected.');
        //     return; 
        // }
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
            this.setState({renderCoponentFlag:false});
            console.log("yes internet ");
            fetch(Global.API_URL+'Grocery/Shop/category', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    Shopid:5
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson); 
                if(Object.keys(responseJson.data).length > 0){
                    let list = [];
                    let content1 = [];
                    var ckeyT = 0;
                    var catTName = '';
                    var last = responseJson.data[responseJson.data.length -1].gro_subcat_id;
                    //console.log(last);
                    for(let data of responseJson.data){
                        if(data.gro_cat_id == ckeyT){
                            ckeyT = data.gro_cat_id;
                            var temp = {
                                sKey :data.gro_subcat_id,
                                sName : data.subcat_name,
                                sPic : (data.spic) ? data.spic : "http://gangacart.com/storage/app/public/offer/ImageNotFound.png"
                            }
                            content1.push(temp);
                            if(data.gro_subcat_id == last){
                                let title = {
                                    title : this.catTName ,
                                    content : content1 
                                };
                                list.push(title);
                            }
                        }
                        else{
                            if( ckeyT != 0){
                                let title = {
                                    title : this.catTName ,
                                    content : content1 
                                };
                                list.push(title);
                                content1 = [];
                                this.catTName = data.gro_cat_name;
                                var temp = {
                                    sKey :data.gro_subcat_id,
                                    sName : data.subcat_name,
                                    sPic : (data.spic) ? data.spic : "http://gangacart.com/storage/app/public/offer/ImageNotFound.png"
                                }
                               content1.push(temp);                                                                           
                            }
                            else{
                                this.catTName = data.gro_cat_name;
                                var temp = {
                                    sKey :data.gro_subcat_id,
                                    sName : data.subcat_name,
                                    sPic : (data.spic) ? data.spic : "http://gangacart.com/storage/app/public/offer/ImageNotFound.png"
                                }
                               content1.push(temp);
                            }
                            ckeyT = data.gro_cat_id;
                        }
                    }
                    this.setState({CategoryData:list,
                        renderCoponentFlag:true});
                }
                }).catch((error) => {
                    console.log("on error featching:"+error);
            });
        }
        });
        console.log(connectionInfoLocal);  
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
        this.fatchCategory();
    }

    _renderHeader(item, expanded) {
        return (
          <View style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            backgroundColor: "#fffeff" }}>
          <Text style={{ fontWeight: "600" }}>
              {" "}{item.title}
            </Text>
            {expanded
              ? <Icon style={{ fontSize: 18 }} name="minus" />
              : <Icon style={{ fontSize: 18 }} name="plus" />}
          </View>
        );
      }
    _renderContent(Item,props) {
       // console.log(props);
        return (
            <List>
                <FlatList 
                    data = {Item.content}
                    renderItem={({item}) => {return(
                        <ListItem avatar onPress = {() => {props.navigation.navigate('ShopsProductsList',{
                            sid: item.sKey
                        })}} >
                            <Left>
                                <Thumbnail source={{ uri: item.sPic }} />
                            </Left>
                            <Body>
                                <Text>{item.sName}</Text>
                            </Body>
                        </ListItem>
                    )} }
                    keyExtractor={item => item.sKey.toString()}
                >
                </FlatList>
            </List>
        );
    }
    render() {
        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container>
                    <Content padder style={{ backgroundColor: "#f4f3f7" }}>
                        <Accordion
                            dataArray={this.state.CategoryData}
                            animation={true}
                            expanded={true}
                            renderHeader={this._renderHeader}
                            renderContent={(item) => this._renderContent(item,this.props)}
                        />
                    </Content>
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