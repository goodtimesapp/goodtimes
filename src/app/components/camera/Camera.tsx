import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, Alert, Modal } from 'react-native';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { Location } from './../../models/Location';
import uuidv4 from 'uuid/v4';
import Geolocation from '@react-native-community/geolocation';
import { Icon, Fab } from 'native-base';
import { withNavigation } from 'react-navigation';


interface Props {
  createLocation: (location: Location) => void;
  navigation: any
}

interface State {
  visible: boolean
}

class Camera extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: true
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
            flashMode={RNCamera.Constants.FlashMode.on}
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
            onGoogleVisionBarcodesDetected={({ barcodes }) => {
              console.log(barcodes);
            }}
            onBarCodeRead={this.handleBarCodeRead}
          >
            <BarcodeMask />
          </RNCamera>
          <View>
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
        </View>
      </Modal>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      Geolocation.getCurrentPosition(location => {
        console.log(location)
        let coords = `[${location.coords.latitude},${location.coords.longitude}]`;
        let loc: Location = {
          description: 'a bin location',
          tag: 'bin',
          externalId: uuidv4(),
          type: 'circle',
          radius: '50',
          coordinates: coords
        }
        this.props.createLocation(loc);
        this.back();
      });
    }
  };

  back = async () => {
    if (this.camera) {
      this.setState({
        visible: false
      });
      this.props.navigation.navigate('Markers');
    }
  }


  handleBarCodeRead = (e: any) => {
    console.warn('QR code detected', e.data);
  }
}

// @ts-ignore
export default withNavigation(Camera);

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