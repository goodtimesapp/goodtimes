import React from 'react';
import { StyleSheet, View, Text, Image, I18nManager, Modal, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';
// @ts-ignore
import AppIntroSlider from 'react-native-app-intro-slider';
I18nManager.forceRTL(false);
import AsyncStorage from '@react-native-community/async-storage';
import { goodtimes, goose, pplBeach, lite, peace, wild, goodtimesNeon } from './../assets/index';
import { material } from 'react-native-typography';
import { LoginSplashPage } from './blockstack/Index';
import { whileStatement } from '@babel/types';


interface Props {
  navigation: any
}
interface State {
  visible: boolean,
  showIntro: boolean
}

export class Splash extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: true,
      showIntro: false,
    };
  }

  async componentDidMount() {
    // this.setState({
    //   showIntro: false,
    //   visible: false
    // });
    await this.checkIfUserHasSeenIntro();
  }

  async checkIfUserHasSeenIntro() {
    try {
      const value = await AsyncStorage.getItem('hasSeenIntro')
      if (value === 'true') {
        setTimeout(() => {
          this.setState({
            visible: false
          });
          this.back("DiscoverFeed");
        }, 100)
      } else {
        this.setState({
          showIntro: true
        });
        AsyncStorage.setItem('hasSeenIntro', 'true');
      }
    } catch (e) {
      this.setState({
        showIntro: true
      });
      AsyncStorage.setItem('hasSeenIntro', 'false');
      // do nothing continue to intro page
    }
  }

  closeSplashModal(){
    this.setState({
      visible: false
    });
  }


  _renderItem = ({ item, dimensions }: any) => (
    <LinearGradient
      style={[
        styles.mainContent,
        {
          flex: 1,
          paddingTop: item.topSpacer,
          paddingBottom: item.bottomSpacer,
          width: dimensions.width,
        },
      ]}
      colors={item.colors}
      start={{ x: 0, y: 0.1 }}
      end={{ x: 0.1, y: 1 }}
    >

      {/* <Icon style={{ backgroundColor: 'transparent', fontSize: 200, color: 'white' }} name={item.icon}/>  */}

      <ImageBackground source={item.backgroundImage} style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)' }} >

        {
          item.goodlogo
          ? <Text style={[material.display3White, { color: item.textColor, textAlign: 'center', paddingTop: item.topPad }]}>Goodtimes</Text>
          : null
        }
       
        <View style={{ width: '100%', height: '100%', alignContent: 'center', alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: item.contentPad }} >
          {
            item.image
              ?
              <View>
                <Image source={item.image} style={[styles.roundImage]} ></Image>
                <Text style={{ position: 'relative', backgroundColor: 'rgba(0, 0, 0, 0.35)', width:Dimensions.get('window').width , height: 100 , marginTop: -200 }}>
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                </Text>
              </View>
              : null
          }
          {
            item.splash
              ? <Text style={[material.display3White, { color: item.textColor, textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: 16, width: '100%' }]}>{item.splash}</Text>
              : null
          }
          {
            item.title
              ? <Text style={[material.display3White, { color: item.textColor, textAlign: 'center' }]}>{item.title}</Text>
              : null
          }
          {
            item.goodlogo
              ?
              <View style={{ marginTop: 10 }} >
                <View style={{ backgroundColor: 'white', width: 52, height: 52, borderRadius: 12, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={goodtimes} style={{ width: 45, height: 45 }} ></Image>
                </View>
              </View>
              : null
          }
          {
            item.text
            ? <View>
                <Text />
                <Text style={[material.title, styles.text, {color: item.textColor}] }>{item.text}</Text>
              </View>
            : null
          }
          
          {
            item.login
              ? <LoginSplashPage closeSplashModal={this.closeSplashModal.bind(this)}></LoginSplashPage>
              : null
          }
        </View>
      </ImageBackground>

    </LinearGradient>
  );



  splashEL = <LinearGradient
    style={[
      styles.mainContent,
      {
        flex: 1,
      },
    ]}
    colors={['white', 'white']}
    start={{ x: 0, y: 0.1 }}
    end={{ x: 0.1, y: 1 }}>
    <View>
      {
        goodtimes
          ? <Image source={goodtimes} style={{ resizeMode: 'center' }} ></Image>
          : <Text />
      }
    </View>
  </LinearGradient>;

  introEL = <AppIntroSlider
    onDone={() => this.back('Markers')}
    slides={slides}
    renderItem={this._renderItem}
    // bottomButton
    showPrevButton
    showSkipButton
    //hideNextButton
    // hideDoneButton
    onSkip={() => this.back('Markers')}
  />


  render() {
    let renderEl = this.splashEL;
    if (this.state.showIntro) {
      renderEl = this.introEL;
    }
    return (
      <Modal animationType="fade"
        transparent={false}
        visible={this.state.visible}
        onRequestClose={() => this.back('Markers')}>
        {renderEl}
      </Modal>
    );
  }

  back = async (route: string) => {
    this.setState({
      visible: false
    });
    this.props.navigation.navigate(route);
  }
}

const slides = [
  {
    key: '1',
    // image: neonGoodtimes,
    // title: 'Goodtimes',
    text: "The social app for where you're at",
    goodlogo: true,
    icon: 'planet',
    colors: ['#212121', '#212121'],
    topPad: 90,
    contentPad: -405,
    backgroundImage: goose,
    textColor: 'white'
  },
  {
    key: '2',
    title: 'Meet',
    text: "Get out, meet, and do!",
    icon: 'ios-options',
    colors: ['#212121', '#212121'],
    backgroundImage: lite,
    topPad: 90,
    contentPad: -405,
    textColor: 'white'
  },
  {
    key: '3',
    title: 'Discover',
    text: "Find new friends and places",
    icon: 'ios-options',
    colors: ['#212121', '#212121'],
    topPad: 90,
    contentPad: -405,
    backgroundImage: pplBeach,
    textColor: 'black'
  },
  {
    key: '4',
    title: 'Share',
    text: "Share photos, files, videos and experiences when you get there",
    icon: 'ios-options',
    colors: ['#212121', '#212121'],
    topPad: 50,
    contentPad: -500,
    backgroundImage: peace,
    textColor: 'white'
  },
  {
    key: '5',
    title: 'Privacy Included',
    text: "You're in good hands with Goodtimes!  Your data is Geo-Fenced in the location you're at and it is deleted after 24 hours. We will never track or sell your data. We won't bore you with the details...but we use strong encryption and you manage the keys!",
    icon: 'ios-beer',
    colors: ['#212121', '#212121'],
    topPad: 90,
    contentPad: -150,
    textColor: 'white',
    backgroundImage: wild,
  },
  {
    key: '6',
    text: "Make Goodtimes 🤙",
    icon: 'ios-beer',
    colors: ['white', 'white'],
    login: true,
    textColor: 'white',
    topPad: -50,
    backgroundImage: goodtimesNeon
  },
];

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 320,
    height: 320,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },
  roundImage: {
    width: 375,
    height: 325,
    resizeMode: 'contain',
    borderRadius: 10
  }
});

// @ts-ignore
export default withNavigation(Splash);


