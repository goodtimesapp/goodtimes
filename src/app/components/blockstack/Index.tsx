import { connect } from 'react-redux';
import { State } from './../../reduxStore/index';
import { 
  getUserSession,
  getProfileState,
  getUserName,
  createAccountSilently,
  logout,
  silentLogin,
} from './../../reduxStore/profile/profile.store';
import Profile from './Profile'
import Radiks from './Radiks'
import LoginSplash from './LoginSplash';

// Global State
const mapStateToProps: any = (state: State) => ({
  userSession: getUserSession(state.profile),
  getProfileState: getProfileState(state.profile),
  getUserName: getUserName(state.profile)
})

// Actions to dispatch
const mapDispatchToProps = {
    createAccountSilently:  createAccountSilently,
    logout: logout,
    silentLogin: silentLogin
}

export let ProfilePage = connect<any, any, any>(mapStateToProps, mapDispatchToProps)(Profile);
export let RadiksPage = connect<any, any, any>(mapStateToProps, mapDispatchToProps)(Radiks);
export let LoginSplashPage = connect<any, any, any>(mapStateToProps, mapDispatchToProps)(LoginSplash);
