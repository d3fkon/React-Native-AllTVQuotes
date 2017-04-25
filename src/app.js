/**
 * Created by d3fkon on 23/4/17.
 */
import React from 'react';
import IndexComponent from 'Ex9_1/src/components/index';
import PlayerComponent from 'Ex9_1/src/components/player';
import {Router, Scene} from 'react-native-router-flux';
import {StyleSheet, Text} from "react-native";

let cPrimary = "#009688";


export default class App extends React.Component {
    renderTitle = (props) => {
        return (
            <Text style={styles.navTitle}>{props.leftTitle}</Text>
        )
    }
    render () {
        return (

            <Router>
                <Scene key="root">
                    <Scene
                        key="page1"
                        component={IndexComponent}
                        leftTitle="All TV Quotes"
                        navigationBarStyle={styles.navbar}
                        // titleStyle={styles.navTitle}
                        // leftButtonIconStyle={{tintColor: "white"}}
                        renderBackButton={this.renderTitle.bind(this)}
                    />
                    <Scene
                        key="page2"
                        component={PlayerComponent}
                        navigationBarStyle={styles.navbar}
                        leftTitle="Quote"
                        // letTitle={this.props.title}
                        renderBackButton={this.renderTitle.bind(this)}
                    />
                </Scene>
            </Router>
        )
    }
}

var styles = StyleSheet.create({
    navbar: {
        backgroundColor: cPrimary,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        elevation: 4
    },
    navTitle: {
        fontSize: 20,
        fontWeight:"bold",
        color: "white",
        marginLeft: 10
    }
})

