
import React, { Component } from "react";
import {
    View,
	TouchableOpacity,
	AsyncStorage
} from "react-native";
import Icon  from 'react-native-vector-icons/Feather';
import {  Badge,  } from 'react-native-elements'
// import Global from "../constants/Global";

export default class CartButton extends React.Component{
	constructor(props){
		super(props);
		this.state={
			cartNo:0	
					}
	}

	_start =async()=>{
		try {
			let a = await AsyncStorage.getItem('CartList');
			a = JSON.parse(a);
			this.setState({cartNo:a.length});
		} catch (error) {
			
		}
		
	}

	render(){
		this._start();
		return(
			<View style={{backgroundColor:"#2874f0",flexDirection: 'row',}}>
				<TouchableOpacity onPress={() => { this.props.obj.navigate('Search') } }>
					<View style={{flexDirection:'row',marginLeft:5}}>
						<Icon name="search" style={{color: 'white', padding: 10, marginLeft:5, fontSize: 25}}/>
						{/* <Badge value={this.state.cartNo} status="error"  containerStyle={{ position: 'absolute', top: -4, right: 1 }} /> */}
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => { this.props.obj.navigate('MyCart') } }>
					<View style={{flexDirection:'row',marginLeft:5}}>
						<Icon name="shopping-cart" style={{color: 'white', padding: 10, marginLeft:5, fontSize: 25}}/>
						<Badge value={this.state.cartNo} status="error"  containerStyle={{ position: 'absolute', top: -4, right: 1 }} />
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}