import React from "react";
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Button, ScrollView, PermissionsAndroid, Dimensions, Alert, Animated } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Icon, Right, List, Body, Thumbnail } from 'native-base';

interface Props {
    navigation: any;
}
interface State {
    datas: any
}

export class HorizontalScroll extends React.Component<Props, State> {

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

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.radioScrollView}>
                <List horizontal={true}
                    keyExtractor={(item: any, index: any) => 'key' + index}
                    dataArray={this.state.datas}
                    renderRow={data =>

                        <View style={styles.card}>
                            <Thumbnail large source={{ uri: 'https://gaia.blockstack.org/hub/17xxYBCvxwrwKtAna4bubsxGCMCcVNAgyw//avatar-0' }} />

                            <Text uppercase style={styles.text}>
                                {data.externalId || data.description}
                            </Text>
                        </View>
                    }
                >
                </List>
            </ScrollView>
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
        width: 100,
        height: 100
    },
    radioScrollView: {

    },
    text: {

    },
});

export default withNavigation(HorizontalScroll)