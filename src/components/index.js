/**
 * Created by d3fkon on 23/4/17.
 */
import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    ListView,
    TouchableOpacity,
    ScrollView, StatusBar
} from 'react-native';

import {
    View,
    Text,
    ToastAndroid,
    Image,
} from 'react-native';

import Hr from 'react-native-hr'

import * as firebase from 'firebase'
let cPrimaryDark = "#00796B";

const config = {
    apiKey: "AIzaSyCXN_bQJkP-mh3bBDw3RWVBd4_35nspTCk",
    authDomain: "alltvquotes.firebaseapp.com",
    databaseURL: "https://alltvquotes.firebaseio.com",
    projectId: "alltvquotes",
    storageBucket: "alltvquotes.appspot.com",
    messagingSenderId: "688621988579"
};

firebase.initializeApp(config);

export default class IndexComponent extends React.Component {
    constructor(props) {
        super(props);
        let titleAdapter = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let seasonAdapter = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let quoteAdapter = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            name: props.name,
            titleDataSource: titleAdapter.cloneWithRows([]),
            seasonDataSource: seasonAdapter.cloneWithRows([]),
            quoteDataSource: quoteAdapter.cloneWithRows([]),
            titleImgUrl: "",
            titleArray: [],
            seasonArray: [],
            quoteArray: [],
            titlePosition: 0,
            seasonPosition: 0
        }
        this.ref = firebase.database().refFromURL('https://alltvquotes.firebaseio.com/');
        this.newRef = this.ref;
    }

    render() {
        return (
            <View style={styles.container}>

                <StatusBar
                    backgroundColor={cPrimaryDark}
                />
                <ScrollView>
                    <Text style={styles.heading}>Titles</Text>
                    <ListView horizontal={true} dataSource={this.state.titleDataSource}
                              renderRow={this.renderTitles.bind(this)}/>
                    <Text style={styles.heading}>Seasons</Text>
                    <ListView horizontal={true} dataSource={this.state.seasonDataSource}
                              renderRow={this.renderSeasons.bind(this)}/>
                    <Text style={styles.heading}>Quotes</Text>
                    <ListView dataSource={this.state.quoteDataSource} renderRow={this.renderQuotes.bind(this)}/>
                </ScrollView>
            </View>
        );
    }

    listenForItems(ref) {
        ref.on("value", (snapshot) => {
            snapshot.forEach((child) => {
                this.state.titleArray.push({
                    title: child.val().TitleName,
                    url: child.val().TitleImgUrl,
                    key: child.key
                });
            });
            this.setState({
                titleDataSource: this.state.titleDataSource.cloneWithRows(this.state.titleArray)
            })
        })
    }

    renderTitles(rowData, sectionId, position) {
        return (
            <TouchableOpacity onPress={() => {
                this.onTitlePress(position);
            }}>
                <View style={styles.listViewContainer}>
                    <Image source={{uri: rowData.url}} style={styles.listImage}/>
                    <Text style={styles.listText}>{rowData.title}</Text>
                </View>
            </TouchableOpacity>

        )

    }

    onTitlePress(i) {
        ToastAndroid.show(i.toString(), ToastAndroid.SHORT);
        this.setState({
            seasonArray: [],
            titleImgUrl: this.state.titleArray[i].url,
            titlePosition: i
        });
        this.state.seasonArray = [];
        this.newRef = this.ref.child(this.state.titleArray[i].key).child("Seasons")
        this.newRef.on('value', (snapshot) => {
            snapshot.forEach((child) => {
                this.state.seasonArray.push({
                    title: child.val().SeasonName,
                    key: child.key,
                });
            });
        });
        this.setState({
            seasonArray: this.state.seasonArray,
            seasonDataSource: this.state.seasonDataSource.cloneWithRows(this.state.seasonArray)
        })
    }

    renderSeasons(rowData, sectionId, position) {
        return (
            <TouchableOpacity onPress={() => {
                this.onSeasonPress(position);
            }}>
                <View style={styles.listViewContainer}>
                    <Image source={{uri: this.state.titleImgUrl}} style={styles.listImage}/>
                    <Text style={styles.listText}>{rowData.title}</Text>
                    {/*<Text style={styles.listText}>{this.state.seasonArray[0].key}</Text>*/}
                </View>
            </TouchableOpacity>
        )
    }


    onSeasonPress(i) {
        this.setState({
            quoteArray: [],
            seasonPosition: i
        });
        this.newRef.child(this.state.seasonArray[i].key).child("Quotes").on('value', (snapshot) => {
            snapshot.forEach((child) => {
                this.state.quoteArray.push({
                    quote: child.val().QuoteText,
                    author: child.val().Author
                });
            });
        });
        this.setState({
            quoteDataSource: this.state.quoteDataSource.cloneWithRows(this.state.quoteArray)
        })
    }

    renderQuotes(rowData, sectionId, position) {
        return (
            <View style={styles.quoteContainer}>
                <Text style={styles.quoteText}>{rowData.quote}</Text>
                <Hr lineColor={'#ebebeb'}/>
                <Text style={styles.quoteAuthor}>{rowData.author}</Text>
            </View>
        )
    }

    componentDidMount() {
        this.listenForItems(this.ref)
    }


}
IndexComponent.defaultProps = {
    name: "Hello"
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ebebeb",
        paddingTop: 60
    },
    heading: {
        marginLeft: 5,
        fontSize: 25,
        color: 'black'
    },
    listViewContainer: {
        backgroundColor: "#fff",
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        elevation: 1,
    },
    quoteContainer: {
        backgroundColor: "#fff",
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        elevation: 1,
        padding: 10
    },
    listText: {
        fontSize: 18,
        textAlign: "center",
        margin: 5,
    },
    listImage: {
        height: 120,
        width: 213.33
    },
    quoteText: {
        marginTop: 5,
        marginBottom: 15,
        marginLeft: 5,
        fontSize: 18
    },
    quoteAuthor: {
        marginTop: 15,
        marginBottom: 5,
        marginLeft: 5,
        fontSize: 15
    },
})
AppRegistry.registerComponent("IndexComponent", () => IndexComponent);