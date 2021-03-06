import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom'
import Index from './component/index.js';
import Card from './component/card.js';

import './asset/style/index.less'
import storeUtil from '@/util/storeUtil'
import EntryComponent from "@/component/EntryComponent";
import {getParam} from "@/util/urlUtil";

class Quiz extends EntryComponent {

    constructor(props) {
        super(props)
        console.log('constructor');
        let urlParam = getParam();

        let quiz_id = urlParam.id;
        let quiz_case = urlParam.case;
        let quiz_title = urlParam.title;

        storeUtil.set('quiz_id', quiz_id);
        storeUtil.set('quiz_bar', (quiz_case && quiz_case == '1'));//小节测验
        storeUtil.set('quiz_title', quiz_title);
    }

    componentDidMount() {
    }

    render() {
        return (
            <Router basename="/cquiz">
                <div className="quiz-main">
                    <Route exact path="/" component={Index}/>
                    <Route exact path="/card" component={Card}/>
                </div>
            </Router>
        )
    }
}

ReactDOM.render(<Quiz/>, document.getElementById('root'))