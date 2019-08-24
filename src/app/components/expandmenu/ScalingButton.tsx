import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  Animated,
  Easing,
  TouchableWithoutFeedback
} from 'react-native';

const ScalingButton = (props:any) => {

	var scaleValue = new Animated.Value(0);	
	
	function scale() {
  		scaleValue.setValue(0);
		Animated.timing(
			scaleValue,
			{
			  toValue: 1,
              duration: 300,
              // @ts-ignore
			  easing: Easing.easeOutBack
			}
		).start();
	}

	function onPress() {
		scale();
		props.onPress();
	}

	function getContent() {
		if(props.children){
			return props.children;
		}
		return <Text style={props.styles.label}>{ props.label }</Text>;
	}

	const buttonScale = scaleValue.interpolate({
	  inputRange: [0, 0.5, 1],
	  outputRange: [1, 1.1, 1]
	});

	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<Animated.View style={[ 
				props.noDefaultStyles ? styles.default_button : styles.button, 
				props.styles ? props.styles.button : '',
				{
					transform: [
						{scale: buttonScale}
					]
				}
				]}
			>
		    	{ getContent() }
			</Animated.View>
		</TouchableWithoutFeedback>
	);
}	
	
const styles = StyleSheet.create({
	default_button: {
		alignItems: 'center',
        justifyContent: 'center'
	},
	button: {
		alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderWidth: 1,
		borderColor: '#eee',
		margin: 20
    },
});

export default ScalingButton;