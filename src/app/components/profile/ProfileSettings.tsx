import React from "react";
import { Text, Image, Alert, Animated, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native'
import { Container, Content, Header, Icon, Left, Body, Right, Badge, Title, Thumbnail, Item, Input, Button } from "native-base";
import { withNavigation } from 'react-navigation';
import { human, iOSUIKit } from 'react-native-typography';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import { State as ReduxState } from './../../reduxStore/index';
import {
  getUserSession,
  getProfileState,
  getUserName,
  putProfileSettings,
  getProfileSettings,
  profileSettingsSelector
} from './../../reduxStore/profile/profile.store';
import {Profile} from './../../models/Profile';

interface Props {
  navigation: any;
  putProfileSettings: (profile: Profile)=> void;
  getProfileSettings: () => void;
  profileSettingsSelector: Profile
}
interface State {
  avatarSource: any;
  firstName: string;
}

const options = {
  title: 'Choose an image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export class ProfileSettings extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    
    this.state = {
      avatarSource: null,
      firstName: ""
    };
  }

 

  componentDidMount() {
    this.props.getProfileSettings();
  }

  componentDidUpdate(data: any){
    console.log('componentDidUpdate =>', data);
    if (this.props.profileSettingsSelector !== data.profileSettingsSelector){
        this.setState({
          firstName: data.profileSettingsSelector.attrs.firstName,
          avatarSource: data.profileSettingsSelector.attrs.image
        });
    }
  }

  chooseImage() {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //const source = { uri: response.uri };
        // You can also display the image using data:
        // @todo compress image
        const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
          firstName: ""
        });
      }
    });
  }

  saveProfile(){
    //Alert.alert(this.state.firstName, this.state.avatarSource.uri);
    let profile: Profile = new Profile({
      firstName: this.state.firstName,
      image: this.state.avatarSource.uri
    });
    this.props.putProfileSettings(profile);
    // this.props.navigation.navigate('Goodtimes');
  }


  render() {
    return (


      <View style={{
        flex: 1,
        backgroundColor: "#283447",
        justifyContent: "center"
      }}>
        <ScrollView>
          <View style={{
            marginTop: 32,
            justifyContent: "center",
            alignSelf: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
            <View style={{
              height: 50,
              justifyContent: "center",
              alignSelf: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
              <Text style={[human.largeTitle, { color: "#b4c2db" }]}>Profile Settings</Text>
            </View>
            <View style={{
              padding: 16,
              justifyContent: "center",
              alignSelf: 'center',
              alignItems: 'center',
              width: '80%',
            }}>
              <Text style={[human.body, { color: "#b4c2db" }]}>Please choose a profile picture with a clear picture of your face.
                Then input your real first name.
            </Text>
            </View>
            <View style={{
              height: 300,
              justifyContent: "center",
              alignSelf: 'center',
              alignItems: 'center',
              width: '100%',
            }} >
              <TouchableOpacity onPress={() => { this.chooseImage() }}>
                {
                  this.state.avatarSource !== null
                  ? <Image style={{ alignSelf: "center", width: 200, height: 200, borderRadius: 100 }} source={{uri: this.state.avatarSource}} />
                  : <Image style={{ alignSelf: "center", width: 200, height: 200, borderRadius: 100 }} source={require('./../../assets/profile.png')} />
                }
                
                <View style={{
                  height: 32,
                  marginTop: -26
                }}>
                  <View style={{ flex: 1,
                   alignSelf: "center",
                   height: 30,
                   width: 120,
                   backgroundColor: "#ff5230",
                   borderRadius: 21,
                   justifyContent: 'space-evenly',
                   alignItems: 'center',
                   flexDirection: "row" }}>
                      <Text style={{ color: "#ffffff", fontSize: 18 }}>Upload</Text>
                      <Icon style={{ color: "#ffffff", fontSize: 18 }} name="md-camera" ></Icon>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{
              height: 100,
              justifyContent: "center",
              alignSelf: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
              <Content style={{ flex: 1 }}>
                <Item rounded style={{
                  backgroundColor: "#283447",
                  height: 42,
                  borderRadius: 21,
                  borderColor: "#77849b",
                  borderWidth: 1,
                  width: 320
                }}>
                  <Input 
                    placeholder='First Name'
                    value={this.state.firstName}
                    style={[human.body, { color: "#ff5230", width: 320 }]}
                    onChangeText={(firstName)=>{this.setState({firstName})}} />
                </Item>
              </Content>
            </View>
            <View style={{
              height: 50,
              alignSelf: "flex-end",
              marginRight: 30,
              marginTop: -18
            }}>
              <Content style={{ flex: 1 }}>
                <TouchableOpacity style={{
                  height: 42,
                  width: 120,
                  backgroundColor: "#ff5230",
                  borderRadius: 21,
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  flexDirection: "row"
                }}
                onPress={()=>{this.saveProfile()}}
                >
                  <Text style={{ color: "#ffffff", fontSize: 18 }}>Next</Text>
                  <Icon style={{ color: "#ffffff", fontSize: 18 }} name="md-arrow-round-forward" ></Icon>
                </TouchableOpacity>
              </Content>
            </View>
          </View>
        </ScrollView>
      </View>

    )
  }


}


const styles = StyleSheet.create({

});


// Global State
const mapStateToProps: any = (state: ReduxState) => ({
  profileSettingsSelector: profileSettingsSelector(state.profile)
})
// Actions to dispatch
const mapDispatchToProps = {
  putProfileSettings: putProfileSettings,
  getProfileSettings: getProfileSettings
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)((withNavigation(ProfileSettings)))

