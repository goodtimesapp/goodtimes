import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from './Header';
import CardComponent from './goodtimes/Card';
import { Container, Content } from 'native-base'

export class Goodtimes extends Component {

    render() {
        return (
            <View>
                <Header />
                <ScrollView>
                    
                    <CardComponent 
                        likes={19} 
                        avatar='https://media.bizj.us/view/img/10820856/jimfitterling*750xx771-1028-11-0.png' 
                        image='https://images.unsplash.com/photo-1525183995014-bd94c0750cd5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1275&q=80'
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

const mapStateToProps = (state: any) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Goodtimes)
