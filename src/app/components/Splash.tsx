import React from 'react';
import { StyleSheet, View, Text, Image, I18nManager, Modal } from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';
// @ts-ignore
import AppIntroSlider from 'react-native-app-intro-slider';
I18nManager.forceRTL(false);
import AsyncStorage from '@react-native-community/async-storage';


interface Props {
  navigation: any
}
interface State {
  visible: boolean,
  showIntro: boolean
}

export class Splash extends React.Component<Props, State> {
 
  constructor(props:Props){
    super(props);
    this.state = {
      visible: true,
      showIntro: false,
    };
  }

  async componentDidMount() {
    await this.checkIfUserHasSeenIntro();
  }

  async checkIfUserHasSeenIntro() {
    try {
      const value = await AsyncStorage.getItem('hasSeenIntro')
      if( value === 'true') {
        setTimeout( ()=>{
          this.setState({
            visible: false
          });
          this.back("Markers");
        }, 100 )
      } else {
        this.setState({
          showIntro: true
        });
        AsyncStorage.setItem('hasSeenIntro', 'true');
      }
    } catch(e) {
        this.setState({ 
          showIntro: true
        });
        AsyncStorage.setItem('hasSeenIntro', 'false');
        // do nothing continue to intro page
    }
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
      <Icon style={{ backgroundColor: 'transparent', fontSize: 200, color: 'white' }} name={item.icon}/> 
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
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
        {/* <Image source={ require('./../assets/plasticoinclogo.png') } /> */}
        <Text style={[styles.text, {color: 'grey'}]}>Goodtimes</Text>
        <Text/>
        <Text/>
        <Text style={[styles.text, {color: 'grey'}]}>The social app for where you're at [privacy included]</Text>
      </View>
  </LinearGradient>;

  introEL =   <AppIntroSlider
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
    if (this.state.showIntro){
      renderEl = this.introEL;
    } 
    return (
      <Modal animationType="fade"
      transparent={false}
      visible={this.state.visible}
      onRequestClose={() => this.back('Markers')}>      
        { renderEl }
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

// @ts-ignore
export default withNavigation(Splash);

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
});

const slides = [
  {
    key: 'somethun',
    title: 'Goodtimes',
    text:
      'Get rewarded for recycling!',
    icon: 'planet',
    colors: ['#63E2FF', '#B066FE'],
  },
  {
    key: 'somethun1',
    title: 'Super customizable',
    text:
      'The component is also super customizable, so you can adapt it to cover your needs and wants.',
    icon: 'ios-options',
    colors: ['#A3A1FF', '#3A3897'],
  },
  {
    key: 'somethun2',
    title: 'No need to buy me beer',
    text: 'Usage is all free',
    icon: 'ios-beer',
    colors: ['#29ABE2', '#4F00BC'],
  },
];
