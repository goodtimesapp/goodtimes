import { connect } from 'react-redux';
import { State } from './../../reduxStore/index';
import { 
  getUserSession,
  getProfileState,
  getUserName,
  createAccountSilently,
  blockstackLogin,
  logout,
  silentLogin,
} from './../../reduxStore/profile/profile.store';
import Profile from './Profile'

// Global State
const mapStateToProps: any = (state: State) => ({
  userSession: getUserSession(state.profile),
  getProfileState: getProfileState(state.profile),
  getUserName: getUserName(state.profile)
})

// Actions to dispatch
const mapDispatchToProps = {
    createAccountSilently:  createAccountSilently,
    blockstackLogin: blockstackLogin,
    logout: logout,
    silentLogin: silentLogin
}

export let ProfilePage = connect<any, any, any>(mapStateToProps, mapDispatchToProps)(Profile);
