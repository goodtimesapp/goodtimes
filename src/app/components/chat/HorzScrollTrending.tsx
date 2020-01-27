import React from "react";
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Button, ScrollView, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Icon, Right, List, Body, Thumbnail } from 'native-base';
import { human, iOSUIKit } from 'react-native-typography';

interface Props {
    navigation: any;
}
interface State {
    datas: any
}

export class HorzScrollTrending extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            datas: [
                { tag: 'Starbucks' },
                { tag: 'Meetup' },
                { tag: 'Tiny Tap' },
                { tag: 'Merch Mart' },
                { tag: 'Work' }
            ]
        }

    }

    render() {
        return (
            <View>
                <Text style={{ color: 'white', paddingBottom: 6 }}>Trending</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.radioScrollView}>
                    <List horizontal={true}
                        keyExtractor={(item: any, index: any) => 'key' + index}
                        dataArray={this.state.datas}
                        renderRow={data =>

                            <View style={styles.card}>
                                {/* <Thumbnail source={{ uri: 'https://gaia.blockstack.org/hub/17xxYBCvxwrwKtAna4bubsxGCMCcVNAgyw//avatar-0' }} /> */}

                                {/* <Text uppercase style={styles.text}>
                                {data.tag}
                            </Text> */}

                                <TouchableOpacity
                                    style={[styles.hashTagRight, { backgroundColor: 'hotpink' }]}>
                                    <Text style={[human.body, { color: "#ffffff", paddingBottom: 2 }]}>
                                        #{data.tag}
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        }
                    >
                    </List>
                </ScrollView>
            </View>
        )
    }
}

const hashTagRootStyles = {
    borderRadius: 18,
    padding: 6,
    marginBottom: 6,
};

const styles = StyleSheet.create({
    hashTag: {
        ...hashTagRootStyles,
        alignSelf: 'flex-start'
    },
    hashTagRight: {
        ...hashTagRootStyles,
        alignSelf: 'flex-end'
    },
    card: {
        height: 75,
        marginRight: 6
    },
    radioScrollView: {

    },
    text: {
        color: 'white'
    },
});

export default withNavigation(HorzScrollTrending)