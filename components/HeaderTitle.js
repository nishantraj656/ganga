
import React, { Component } from "react";
import { Button, Text, View,Modal,Dimensions,TouchableOpacity} from 'react-native';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';

export default class HeaderTitle extends React.Component{
    render(){
        return(
                <Text style={{
                        color:"#fff",
                        padding: 10, 
                        marginLeft:5, 
                        fontSize: 20 , 
                        fontWeight:"900",
                        fontSize:20
                    }}>{this.props.title}
                </Text>
            )
    }
}