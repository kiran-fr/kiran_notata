import React from "react";

import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from '@apollo/react-common';

import classnames from "classnames";
import {
  container,
  saving_class
} from "./Saver.module.css";

class Saver extends React.Component {

  state = {
    init: false
  }

  componentWillUpdate(newProps) {
    if (this.state.init) return;
    if (newProps.saving) {
      this.setState({init: true})
    }
  }

  render() {

    let { saving } = this.props;

    return (
      <div
        className={classnames(container, saving && saving_class)}
        style={{
          display: this.state.init ? 'block' : 'none'
        }}
        >
        {
          saving && (
            <div>...saving</div>
          ) || (
            <div>saved</div>
          )
        }
      </div>
    )
  }
}

export default Saver;