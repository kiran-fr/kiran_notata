import React from 'react';
import classnames from 'classnames';
import {
  page_header,
  progress_bars,
  progress_bar
} from './PageHeader.module.css';
import dd from './combinedData';
import { findIndex } from 'lodash';

export class PageHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollTop: 0,
      currentIndex: 0,
      tops: []
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll(event) {
    let { scrollTop } = document.documentElement;
    let { currentIndex } = this.state;
    let { tops } = this.props;
    let scrollingDown = scrollTop > this.state.scrollTop;    
    let currentTop = tops[currentIndex]
    let previousTop = tops[currentIndex-1]
    let diff = - 75;
    this.setState({scrollTop})
    if (scrollingDown && (scrollTop > currentTop+diff)) {
      this.setState({currentIndex: currentIndex+1})
    }
    if (!scrollingDown && (scrollTop < previousTop+diff)) {
      this.setState({currentIndex: currentIndex-1})
    }
  }

  render() {
    let { d } = this.props;
    let index = findIndex(dd, _d => _d.title === d.title);
    return (
      <div className={classnames(page_header, d.className)} >
        <h1>{d.title}<span style={{opacity: 0.3}}> - {this.props.name} - ({index+1}/{dd.length})</span></h1>
        <div className={progress_bars}>
          {
            d.questions.map((q, i) => (
              <div
                key={`q-${i}`}
                className={classnames(
                  progress_bar,
                  (this.state.currentIndex === i+1) ? d.className : '',
                  (this.state.currentIndex === 0 && i === 0) ? d.className : ''
                )}
                >
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

