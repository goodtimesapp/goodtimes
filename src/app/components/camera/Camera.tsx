import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { Location } from './../../models/Location';
import uuidv4 from 'uuid/v4';
import Geolocation from '@react-native-community/geolocation';
import { Icon, Fab } from 'native-base';
import { withNavigation } from 'react-navigation';
declare let window: any;
import RNFetchBlob from 'rn-fetch-blob';
import { connect } from 'react-redux';
import { getBase64, setBase64 } from './../../reduxStore/global/global.store';
import { State as ReduxState } from './../../reduxStore/index';
// @ts-ignore
import { RNPhotoEditor } from 'react-native-photo-editor'


interface Props {
  createLocation: (location: Location) => void;
  navigation: any;
  getBase64: any;
  setBase64: (base64:string) => void;
}

interface State {
  visible: boolean,
  imageUrl: any;
  base64: string;
}

class Camera extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: true,
      imageUrl: '',
      base64: '',
    }
  }

  camera: any;


  render() {
    return (
      <Modal animationType="slide"
        transparent={false}
        visible={this.state.visible}
        onRequestClose={() => this.back()}
      >
        <View style={styles.container}>
          <Fab
            active={true}
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: '#F0F0F0' }}
            position="topLeft"
            onPress={() => this.back() }>
            <Icon name="arrow-back" style={{ fontSize: 20, color: 'black' }} />
          </Fab>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.auto}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
          >
          </RNCamera>

            <Fab
              active={true}
              direction="up"
              containerStyle={{ right: '43%' }}
              style={{ backgroundColor: '#F0F0F0' }}
              position="bottomRight"
              onPress={this.takePicture.bind(this)}>
              <Icon name="camera" style={{ fontSize: 20, color: 'black' }} />
            </Fab>
        </View>
      </Modal>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { 
        quality: 0.8, 
        base64: true,
        fixOrientation: true 
      };
      const data = await this.camera.takePictureAsync(options);
      let  imageUrl =data.uri.replace('file://', '')
     

      RNPhotoEditor.Edit({
        path: imageUrl,
        onDone: () => {
            console.log('on done', imageUrl);
            this.back();
            RNFetchBlob.fs.readFile(imageUrl, 'base64').then( (base64) =>{
                let r = this.props.setBase64(base64);
            }); 
        },
        onCancel: () => {
            console.log('on cancel')
        }
      });

      // Geolocation.getCurrentPosition(location => {
      //   console.log(location)
      //   let coords = `[${location.coords.latitude},${location.coords.longitude}]`;
      //   let loc: Location = {
      //     description: 'a bin location',
      //     tag: 'bin',
      //     externalId: uuidv4(),
      //     type: 'circle',
      //     radius: '50',
      //     coordinates: coords
      //   }
      //   this.props.createLocation(loc);
      //   this.back();
      // });
    }
  };

  back = async () => {
    if (this.camera) {
      this.setState({
        visible: false
      });
      this.props.navigation.navigate('Goodtimes');
    }
  }


  handleBarCodeRead = (e: any) => {
    console.warn('QR code detected', e.data);
  }
}

const mapStateToProps = (state: ReduxState) => ({
  getBase64: getBase64(state.global)
})

const mapDispatchToProps = {
  setBase64: setBase64
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Camera))



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: 'rgba(52, 52, 52, 0.1)',
    borderRadius: 50,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});