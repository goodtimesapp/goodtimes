import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";

import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'
import FitImage from 'react-native-fit-image';


interface Props {
  likes: number;
  image: string;
  name: string;
  avatar: string;
  summary: string;
  createdAt: string;
}

interface State{
  liked: boolean
}

class CardComponent extends Component<Props, State> {


  constructor(props: Props) {
    super(props);
    this.state = {
      liked: 'black'
    }
  }

  render() {
    return (
      <Card style={{ width: '100%', marginLeft: 0 }}>
        <CardItem style={{ width: '100%' }}>
          <Left>
            <Thumbnail source={{ uri: this.props.avatar }} />
            <Body>
              <Text note>{this.props.createdAt}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem cardBody>
            <FitImage source={{ uri: this.props.image }} style={{  borderRadius: 20 }} />
        </CardItem>
        <CardItem style={{ padding: 8 }}>
          <Left>
            <TouchableOpacity style={{margin: 8}} onPress={ ()=>{
              if (this.state.liked === 'black'){
                this.setState({liked: 'red'})
              } else{
                this.setState({liked: 'black'})
              }
              
            }} >
              <Icon type='FontAwesome' name='heart-o' style={{ fontSize: 30, color: this.state.liked}} />
            </TouchableOpacity>
            <TouchableOpacity style={{margin: 8}}>
              <Icon type='FontAwesome' name="comment-o" style={{ fontSize: 30, color: 'black' }} />
            </TouchableOpacity>
            <TouchableOpacity style={{margin: 8}}>
              <Icon type='FontAwesome' name="paper-plane-o" style={{ fontSize: 30, color: 'black' }} />
            </TouchableOpacity>
          </Left>
        </CardItem>

        <CardItem style={{ height: 20 }}>
          <Text>{this.props.likes} likes</Text>
        </CardItem>
        <CardItem>
          <Body>
            <Text>
              <Text style={{ fontWeight: "900" }}>Nick
                            </Text>
              {this.props.summary}
            </Text>
          </Body>
        </CardItem>
      </Card>
    );
  }
}
export default CardComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});