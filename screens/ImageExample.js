import React, { Component } from 'react';
import { Image,Dimensions } from 'react-native';
import { Container, Header, View, DeckSwiper, Card,Button, CardItem, Thumbnail, Text, Left, Body, Icon, Right } from 'native-base';
const {width,height} = Dimensions.get('window');
const cards = [
  {
    text: 'Card One',
    name: 'One',
    image:'http://www.irctc.provogue.com/skin/frontend/default/provogue/images/additional_offer.png'// source(uri'./img/swiper-1.png'),
  },
  {
    text: 'Card Two',
    name: 'Two',
    image:'https://t3.ftcdn.net/jpg/01/17/69/74/240_F_117697431_ZnRN2FRlefOL82un2ParnKUfiC77XpYx.jpg'// source(uri'./img/swiper-1.png'),
  },
  {
    text: 'Card Three',
    name: 'Three',
    image:'https://i.ytimg.com/vi/n07vmL34mMM/maxresdefault.jpg'// source(uri'./img/swiper-1.png'),
  },

];
export default class DeckSwiperAdvancedExample extends Component {

  _Retrive = (t)=>{
   // console.log('Heloo : ',t)
   // t._deckSwiper._root.swipeLeft();   h
}

  render() {
    
    return (
    
      
      <Container style={{height:210}}>
       
        <View>
          <DeckSwiper
            ref={this._Retrive/** (c) => this._deckSwiper = c*/}
            dataSource={cards}
            renderEmpty={() =>
              <View style={{ alignSelf: "center" }}>
                <Text>Over</Text>
              </View>}
            renderItem={item =>
              <Card style={{ elevation: 3,backgroundColor:'#a7abb2' }}>
                <Left/>
                <Body >
                  <CardItem style={{width:width-15}} cardBody>
                    <Image style={{ height: 150, flex: 1, resizeMode: 'contain' }} source={{uri:item.image}} />
                  </CardItem>
                </Body>
                <Right/>
              </Card>
            }
          />
        </View>
       
        {/* <View style={{ flexDirection: "row", flex: 1, position: "absolute", bottom: 50, left: 0, right: 0, justifyContent: 'space-between', padding: 15 }}>
          <Button iconLeft onPress={() => this._deckSwiper._root.swipeLeft()}>
            <Icon name="arrow-back" />
            <Text>Swipe Left</Text>
          </Button>
          <Button iconRight onPress={() => this._deckSwiper._root.swipeRight()}>
            <Icon name="arrow-forward" />
            <Text>Swipe Right</Text>
          </Button>
        </View> */}
     </Container>
    );
  }
}