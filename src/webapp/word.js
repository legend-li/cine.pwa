import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Route,
} from 'react-router-dom'
import LoginDetect from 'component/word/loginDetect';
import Index from 'component/word/index';
import Welcome from 'component/word/welcome';
import UserInfo from 'component/word/userInfo';
import Card from 'component/word/card';
import Report from 'component/word/report';
import * as util from './util'
import 'component/word/style/word.less'


class Word extends React.Component {

    constructor(props) {
        super(props);
        let token = util.getUrlParam('token');
        if (token) {
            util.setToken(token)
        }
    }

    componentWillMount() {
        console.log('componentWillMount')
    }

    render() {
        return (
            <Router>
                <div className="word_main">
                    <div className="map_bg"></div>
                    <Route exact path="/" component={Index}/>
                    <Route path="/welcome" component={Welcome}/>
                    <Route path="/logindetect" component={LoginDetect}/>
                    <Route path="/userinfo" component={UserInfo}/>
                    <Route path="/card" component={Card}/>
                    <Route path="/report" component={Report}/>
                </div>
            </Router>
        )
    }
}

ReactDOM.render(<Word/>, document.getElementById('root'))