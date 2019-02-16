import React from 'react';
import {createStackNavigator} from 'react-navigation';
import { Container, Header, Left,Item,Input, Body, Right, Button, Title, Text,Textarea, Subtitle,Content,Icon, Picker, Form,Card,CardItem, Label, View } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { Rating,AirbnbRating } from 'react-native-elements';
import {
    StyleSheet,
    ImageBackground ,
    Dimensions,
    Image,
    Modal,
    TouchableOpacity,
    Linking,
    NetInfo,
    AsyncStorage,
    ToastAndroid,

} from "react-native";

export default class Feedback extends React.Component{
    constructor(props){
        super(props);
        this.state={ 
            cartID:'',
            token:'',
            starv:1,
            remark:''

        }
    }

    componentDidMount(){

        
        this._start();
        
    }

    _start = async () => {

        let cart = await AsyncStorage.getItem('cartID');
        let token = await AsyncStorage.getItem('Token');
        if(cart == null || token == null){
            console.log("Cart ID is null.");
            return;
        }
        this.setState({
            cartID:JSON.parse(cart),
            token:token,
            starv:this.props.ratting,
            remark:this.props.feedback,
        });
    }
   
    fire = () =>{
        console.log("Ready for submit",this.state.starv );
         fetch('http://gomarket.ourgts.com/public/api/feedback', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization':'Bearer '+this.state.token
            },
            body:JSON.stringify({
                cartID:this.state.cartID,
                remark:this.state.remark.length==0?'.':this.state.remark,
                star:this.state.starv
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.data =='true')
                    ToastAndroid.show("Thanks For your Feedback",10);    
                    console.log("Feedback Data .........",responseJson);
            }).catch((error) => {
                ToastAndroid.show("Somthing Wrongs",10);    
                console.log(error);
            });    
     }
    
    onValueChange(value) {
        this.setState({
          selected: value
        });
    }

    ratingCompleted(rating,thi) {
        console.log("Rating is: " + rating);
        thi.setState({starv:rating});
    }

    render(){
        return(  
        <Container>
            <Header>
                <Body>
                    <Title>Please Give Us </Title>
                    <Subtitle>Please give us valuabel feedback </Subtitle>
                </Body>
            </Header>
            <Content>
                <Form>
                    <Item>
                        <Rating
                            type='custom'
                            //ratingImage={WATER_IMAGE}
                            ratingColor='#3498db'
                            ratingBackgroundColor='#c8c7c8'
                            ratingCount={5}
                            imageSize={30}
                            onFinishRating={(ratting) => this.ratingCompleted(ratting,this)}
                            style={{ paddingVertical: 10 }}
                        />
                    </Item>
                        <Item floatingLabel last>
                        <Label>Remarks (Optional)</Label>
                        <Input 
                            value = {this.state.remark}
                            onChangeText={(text) => {
                                            this.setState({remark:text})
                                        }}
                        />
                    </Item>
                    <Button bordered onPress={()=>{this.fire()}}>
                            <Text>Submit Feedback</Text>
                    </Button>
                </Form>
            </Content>
        </Container>
        );
    }
} 

