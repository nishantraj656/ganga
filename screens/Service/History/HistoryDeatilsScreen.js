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
    Thumbnail,
    Separator
} from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
const {width,height} = Dimensions.get('window');

export default class HistoryDetailsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            LodingModal: false,
            histData:{
                'workerAvtar':'https://i.imgur.com/uj2JaPH.jpg',
                'workerName':'Worker Name',
                'Work':'Work Name',
                'title':'Title',
                'message':'Message',
                'workPorgressStatus':0,
                'billList':[
                    {
                    "work": "1",
                    "price": "00",
                    "work": "Work Name"
                    },
                ],
            },
            
        }
    }
    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
    }

    render() {
        const {renderCoponentFlag} = this.state;
        const Bill = this.props.navigation.getParam('Bill', this.state.histData);
        let TotalBill = 0;
        Bill.billList.map( (s, i) => {
            TotalBill += parseInt(s.price);
        });
        console.log("bill toata:",TotalBill);
        if(renderCoponentFlag){
            return(
                <Container>
                    <Content>
                        <Card>
                            <CardItem>
                                <Thumbnail square source={{ uri: Bill.workerAvtar }} />
                                <Text style={{marginLeft:10,fontSize:25,fontWeight:'700'}}>{Bill.workerName}</Text>
                            </CardItem>
                        </Card>
                        <Card>
                            <Form>
                                <Item>
                                    <Input 
                                        placeholder='Work'
                                        value={Bill.Work}
                                        disabled={true}
                                        />
                                    
                                </Item>
                                
                                <Item regular>
                                    <Input 
                                        placeholder='Enter your work Title'
                                        // onChangeText={(text) => this.setState({title:text})} 
                                        value={Bill.title}
                                        disabled={true}
                                        />
                                </Item>
                                                            
                                <Textarea 
                                    rowSpan={5} bordered 
                                    placeholder="Type Some Message..." 
                                    // conChangeText={(text) => this.setState({message:text})} 
                                    value={Bill.message}
                                    disabled={true}
                                    />
                                <Separator bordered>
                                    <Text>Bill List</Text>
                                </Separator>
                                <Card>
                                    <List dataArray={Bill.billList}
                                        renderRow={(item) =>
                                            <CardItem>
                                                <Left><Text style={{fontWeight:'800'}}>{item.work}:</Text></Left>
                                                <Right><Text>{item.price}</Text></Right>
                                            </CardItem>
                                        }>
                                    </List>
                                    
                                    <CardItem style={{borderTopColor:'#c0baba',borderTopWidth:1}}>
                                        <Left><Text style={{fontWeight:'800'}}>Total:</Text></Left>
                                        <Right><Text style={{fontWeight:'800'}}>{TotalBill}</Text></Right>
                                    </CardItem>
                                </Card>
                                <Separator bordered>
                                    <Text>Work Progress</Text>
                                </Separator>
                                <Card>
                                    <CardItem>
                                        <View style={{flexDirection:'row', alignSelf:'center'}}>
                                            <View style={{flexDirection:'row',backgroundColor: '#e4e4e4',borderRadius:5}}>
                                                <View style={{backgroundColor: '#26a541', width:width*(Bill.workPorgressStatus/5)-width*(0.2), height: 10,alignSelf:'center',borderRadius:5 }} />
                                                {/* <View style={{  width:width*(0.5), height: 10, alignSelf:'center',borderRadius:5 }} />     */}
                                                <Text>{Bill.workPorgressStatus*20}%</Text>
                                            </View>                                            
                                        </View>
                                    </CardItem>
                                </Card>
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