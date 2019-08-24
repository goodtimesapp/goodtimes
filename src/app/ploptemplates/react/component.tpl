import * as React from 'react'
import { {{pascalCase name}} } from '../../models/{{pascalCase name}}'
import { StyleSheet } from 'react-native';
import { View, ListItem, Left, List, Icon, Right, Container, Button, Text } from 'native-base';

interface Props {
    {{camelCase name}}s: {{pascalCase name}}[],
    get{{pascalCase name}}: () => void,
    create{{pascalCase name}}: () => void
}
interface State { }

export default class {{pascalCase name}}Component extends React.Component<Props, State> {
    
    constructor(props: Props) {
        super(props)
    }

    componentDidMount() {

    }

    render() {
        return (
            <Container>
                <List
                    dataArray={this.props.{{camelCase name}}s}
                    renderRow={(item, index) => {                
                        return (
                            <ListItem key={index}>
                                <Left>
                                    <Text>{item._id || item.createdAt || item.updatedAt}</Text>
                                </Left>
                                <Right>
                                    <Icon name="arrow-forward" />
                                </Right>
                            </ListItem>
                        )
                    }}
                >
                </List>
                <List>
                    <ListItem>
                        <Button rounded bordered success  onPress={() => this.props.get{{pascalCase name}}() }><Text>Get {{pascalCase name}}</Text></Button>
                    </ListItem>
                    <ListItem>
                        <Button rounded bordered success  onPress={() => this.props.create{{pascalCase name}}() }><Text>Create {{pascalCase name}}</Text></Button>
                    </ListItem>
                </List>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {

    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 22
    },
    heading: {
        padding: 10,
        fontSize: 44,
        height: 44,
        alignContent: "center"
    }    
})
