import React from "react";
import { Redirect } from "react-router-dom";
import qp from '../../../utils/queryParams'

export default class Component extends React.Component {

  constructor(props) {
    super(props)
    this.state = { link: null }
  }

  componentDidMount() {
    let { link } = qp(this.props.location.search);
    this.setState({link: link[0]})
  }

  render() {
    if (!this.state.link) return <div>nothing to do, duh...</div>
    window.location.href = this.state.link
  }

};













