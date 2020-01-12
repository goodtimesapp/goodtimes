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
  mirrorMode: boolean;
  cameraType: string;
}

class Camera extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: true,
      imageUrl: '',
      base64: '',
      cameraType: 'back',
      mirrorMode: false
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

        
     
      
         

          {/* <Fab
            active={true}
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: '#F0F0F0' }}
            position="topLeft"
            onPress={() => this.back() }>
            <Icon name="arrow-back" style={{ fontSize: 20, color: 'black' }} />
          </Fab> */}
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            mirrorImage={this.state.mirrorMode}
            type={this.state.cameraType}
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

            {/* <Fab
              active={true}
              direction="up"
              containerStyle={{ right: '43%' }}
              style={{ backgroundColor: '#F0F0F0' }}
              position="bottomRight"
              onPress={this.takePicture.bind(this)}>
              <Icon name="camera" style={{ fontSize: 20, color: 'black' }} />
            </Fab> */}

            <TouchableOpacity onPress={ ()=> this.back() } style={styles.back}>
               <Icon name="arrow-back" style={{ fontSize: 50, color: 'white' }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={ ()=> this.toggleCamera() } style={styles.cameraToggle}>
               <Icon name="refresh" style={{ fontSize: 50, color: 'white' }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={ this.takePicture.bind(this) } style={styles.btn}>
               <Icon name="camera" style={{ fontSize: 50, color: 'white' }} />
            </TouchableOpacity>
     
        </View>
      </Modal>
    );
  }

  toggleCamera(){
    if (this.state.cameraType == 'front'){
        this.setState({
          cameraType: 'back'
        })
    } else{
      this.setState({
        cameraType: 'front'
      })
    }
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { 
        quality: 0.6, 
        base64: true,
        fixOrientation: true 
      };
      const data = await this.camera.takePictureAsync(options);
      let  imageUrl =data.uri.replace('file://', '')
     

      // RNPhotoEditor.Edit({
      //   path: imageUrl,
      //   onDone: () => {
      //       console.log('on done', imageUrl);
      //       this.setState({
      //         visible: false
      //       });
      //       RNFetchBlob.fs.readFile(imageUrl, 'base64').then( (base64) =>{
      //           let r = this.props.setBase64(base64);
      //           this.props.navigation.navigate('Post', { base64Photo: 'data:image/jpg;base64,' + base64 });
      //       }); 
      //   },
      //   onCancel: () => {
      //       console.log('on cancel')
      //   }
      // });

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
  btn: {
    position: 'absolute',
    justifyContent: 'center', 
    alignItems: 'center',
    left: 0, 
    right: 0, 
    bottom: 12, 
    backgroundColor: 'rgba(52, 52, 52, 0.1)',
    borderRadius: 70,
    
  },
  cameraToggle:{
    position: 'absolute',
    justifyContent: 'center', 
    alignItems: 'center', 
    right: 10, 
    top: 10, 
    backgroundColor: 'rgba(52, 52, 52, 0.1)',
    borderRadius: 50,
    padding: 8
  },
  back: {
    position: 'absolute',
    top: 10,
    justifyContent: 'center', 
    alignItems: 'center',
    left: 10,
    backgroundColor: 'rgba(52, 52, 52, 0.1)',
    borderRadius: 50,
    padding: 8
  },
});