import React from 'react';
import Link from 'react-router-dom'
import Button from 'material-ui/Button'
import {CircularProgress, LinearProgress} from 'material-ui/Progress'
import * as Service from '../../service/word'
import * as util from '../../util'
import Welcome from './welcome'
import LoginDetect from './LoginDetect'

let count = 0
export default class Index extends React.Component {

    constructor(props) {
        super(props)

        console.log(`this.props.history ${JSON.stringify(this.props.history)}`)
        this.state = {
            logined: false,
            user: {}
        };

        console.log(`this.props.token  ${this.props.token}`)
    }

    componentWillMount() {
        console.log('componentWillMount')
        let query = {};
        if(this.props.token) query.token = this.props.token
        Service.getContentWordConfig(query).then(result => {
            console.log(result)
            if (result.except_case_desc != "no_login") {
                console.log(`result.result.user ${result.result.user}`)
                this.setState({
                    logined: true,
                    user: result.result.user
                })
            }
        })
    }

    componentDidMount() {
        console.log('componentDidMount')

    }

    componentWillReceiveProps() {
        console.log('componentWillReceiveProps')
    }

    shouldComponentUpdate() {
        console.log('shouldComponentUpdate')
        return true;
    }

    componentWillUpdate() {
        console.log('componentWillUpdate')
    }

    componentDidUpdate() {
        console.log('componentDidUpdate')
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')

    }


    render() {
        count++;
        console.log(`render times ${count}`)
        console.log(`this.state.user ${JSON.stringify(this.state.user)}`)
        return (
            <div>
                {this.state.logined ? <Welcome {...this.props} user={this.state.user}/> : <LoginDetect {...this.props}/>}
            </div>
        )
    }
}







