import * as React from "react";
import {Button,Image,View,Platform} from "react-native"
import * as ImagePicker from "expo-image-picker" 
import * as Permissions from "expo-permissions"

export default class PickImage extends React.Component{
    state={
        image:null
    }
    componentDidMount(){
        this.getPerssion()
    }
    render(){
        var {image} = this.state
        return(
            <View style = {{flex:1,alignItems:"center",justifyContent:"center"}}>
                <Button title="Pick Image from camera roll" onPress={this._pickImage}/>
            </View>
        )
    }
    getPerssion=async()=>{
        if(Platform.OS !== "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status !== "granted"){
                alert("Sorry, We need Camera roll Permission")
            }
        }
    }
    _pickImage=async()=>{
        try{
            var result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4,3],
                quality: 1
            })
            if(!result.cancelled){
                this.setState({
                    image:result.data
                })
                this.uploadImage(result.uri)
            }
        }
        catch(E){
            console.log(E)
        }
    }
    uploadImage=async(uri)=>{
        const data = new FormData()
        var fileName = uri.split("/")[uri.split("/").length-1]
        var type = `image/${uri.split(".")[uri.split(".").length-1]}`
        const fileToUpload = {
            uri: uri,
            name: fileName,
            type:type
        }
        data.append("digit",fileToUpload)
        fetch("",{
            method:"POST",
            body:data,
            headers:{
                "content-type":"multipart/form-data"
            }
        })
        .then((response)=>response.json())
        .then((result)=>{
            console.log("Success: ",result)
        })
        .catch((error)=>{
            console.error("Error: ",error)
        })
    }
}