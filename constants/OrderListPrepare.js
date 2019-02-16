import { StyleSheet,
        SectionList,
        RefreshControl,
        Text,
        ToastAndroid, 
        View,
        Button,
        TouchableOpacity,
        AsyncStorage,
        ImageBackground,
        FlatList,
        ActivityIndicator,
        Image } from 'react-native';
import { Toast } from 'native-base';

 
    export async function CartPrepare(item,quantity){

            try {
    
            // await AsyncStorage.setItem('CartList',JSON.stringify([]));
            //   console.log(item);
               
               let cartValue =[];
                let temp =item;
                    temp['Quantity']=quantity;
                    temp['flag']=true;
                let value = await AsyncStorage.getItem('CartList');
                if(value == null){
                    cartValue.push(temp);
                    await AsyncStorage.setItem('CartList',JSON.stringify(cartValue));
                    console.log("New add");
                } 
                else{
                    let flag=false;
                    let tempArray = JSON.parse(value);
                    for(var i=0;i<tempArray.length;i++){
                        let tempValue = tempArray[i];
                        if(tempValue.map == temp.map){
                             tempArray[i] = temp;
                            flag=true;
                            console.log("update ",temp.map);
                            ToastAndroid.showWithGravity("Item Add On the Cart",ToastAndroid.LONG,ToastAndroid.BOTTOM)
                            break;
                       }
                    }
                    if(!flag){
                        tempArray.push(temp);
                        console.log("New add");
                    }
                   // console.log(tempArray);
                    await AsyncStorage.setItem('CartList',JSON.stringify(tempArray));
                }
               
            } catch (error) {
                console.log("Error in cart list",error.message());
            } 
     }
    
      /** remove product */
    export async function CartRemoveItem(item){
    
        try {
    
         //   await AsyncStorage.setItem('CartList',JSON.stringify([]));
           
           let cartValue =[];
           
            let value = await AsyncStorage.getItem('CartList');
            if(value == null){
               return
            } 
            else{
                let flag=false;
                let tempArray = JSON.parse(value);
                for(var i=0;i<tempArray.length;i++){
                    let tempValue = tempArray[i];
                    if(tempValue.map != item.map){
                         
                        cartValue.push(tempArray[i]) 
                        
                   }
                }
               
                console.log(tempArray);
                await AsyncStorage.setItem('CartList',JSON.stringify(cartValue));
            }
           
        } catch (error) {
            console.log("Error in cart list",error.message());
        } 
        
    }
