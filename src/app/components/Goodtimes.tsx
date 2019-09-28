import React, { Component } from 'react'
import { View, Text, ScrollView , Image} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from './Header';
import CardComponent from './goodtimes/Card';
import { State } from './../reduxStore/index';
import { 
  getUserSession,
  getProfileState,
  getUserName,
  createAccountSilently,
  logout,
  silentLogin,
} from './../reduxStore/profile/profile.store';
import { getBase64, selectBase64 } from './../reduxStore/global/global.store';
import { store } from './../reduxStore/configureStore';
import { withNavigation } from 'react-navigation';
declare let window: any;


interface Props{
    navigation: any,
    silentLogin: (state: any)=> void;
    selectBase64: () => string;
}

export class Goodtimes extends Component<Props, State> {

    constructor(props: Props){
        super(props);
    }

    async componentDidMount(){
    
        let profileState = store.getState().profile;
       
        if (profileState.userSession !== undefined){
            // try silent login
            let loggedin = await this.props.silentLogin(profileState);
        } else{
            // or redirect to profile page
            this.props.navigation.navigate('Profile');
        }
  
    }   

    render() {
        return (
            <View>
                <Header />
                <ScrollView>

                   
                    
                    <CardComponent 
                        likes={19} 
                        avatar='https://media.bizj.us/view/img/10820856/jimfitterling*750xx771-1028-11-0.png' 
                        image={'data:image/jpg;base64,' + this.props.selectBase64   }
                        name='Jim'
                        summary='&nbsp;Ea do Lorem occaecat laborum do. Minim ullamco ipsum minim eiusmod dolore cupidatat magna exercitation amet proident qui. Est do irure magna dolor adipisicing do quis labore excepteur. Commodo veniam dolore cupidatat nulla consectetur do nostrud ea cupidatat ullamco labore. Consequat ullamco nulla ullamco minim.'
                    />
                    <CardComponent 
                        likes={3} 
                        avatar='https://banter-pub.imgix.net/users/nicktee.id' 
                        image='https://images.unsplash.com/photo-1556909190-eccf4a8bf97a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80'
                        name='Nick'
                        summary='&nbsp;Ea do Lorem occaecat laborum do. Minim ullamco ipsum minim eiusmod dolore cupidatat magna exercitation amet proident qui. Est do irure magna dolor adipisicing do quis labore excepteur. Commodo veniam dolore cupidatat nulla consectetur do nostrud ea cupidatat ullamco labore. Consequat ullamco nulla ullamco minim.'
                    />
                   <Text/>
                <Text/>
                <Text/>
                <Text/>
                </ScrollView>
                
            </View>
        )
    }
}

// Global State
const mapStateToProps: any = (state: State) => ({
    userSession: getUserSession(state.profile),
    getProfileState: getProfileState(state.profile),
    getUserName: getUserName(state.profile),
    selectBase64: selectBase64(state.global)
})
// Actions to dispatch
const mapDispatchToProps = {
    createAccountSilently:  createAccountSilently,
    logout: logout,
    silentLogin: silentLogin
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)( (withNavigation(Goodtimes)) )
