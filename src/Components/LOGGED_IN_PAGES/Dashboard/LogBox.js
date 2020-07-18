import React from "react";
import { adopt } from "react-adopt";
import { Query, Mutation } from "react-apollo";
import { logPut } from "../../../Apollo/Mutations";
import { logGet } from "../../../Apollo/Queries";
import moment from "moment";
import classnames from "classnames";
import {
  container,
  log_feed,
  log_feed_item,
  log_feed_byline,
  name, date,
  log_feed_text,
  log_item_edited,
  input_form,
  not_ready,
  log_feed_type_SUBJECTIVE_SCORE,
  event_toggle_button,
  empty_message
} from "./LogBox.module.css";
import {
  section,
  section_title
} from "./ConnectionCard.module.css"


class LogBox extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  render() {
    const {
      log,
      error,
      loading,
      connectionId,
      user,
      hideEvents,
      toggleHideEvents
    } = this.props;


    let isLoading = loading && !log;

    let Log = (log || []).filter(l => {
      if (!hideEvents) return l;
      return l.dataPairs[0].key === 'TEXT'
    })

    return (

      <div className={section}>

        <div className={section_title}>
          Log
        </div>

        <div className={container}>


          <div className={log_feed}>

            {
              isLoading && (
                <span>...loading</span>
              )
            }

            {
              !isLoading && !Log.length && (
                <span className={empty_message}>
                  there is nothing here
                </span>
              )
            }

            {
              Log.map((logItem, i) => (
                <div 
                  key={`log-${logItem.id}`}
                  className={log_feed_item}
                  >
                  <div className={log_feed_byline}>
                    <span className={name}>
                      {
                        logItem.createdBy === user.cognitoIdentityId && (
                          <span>You</span>
                        ) || (
                          <span>{logItem.createdByUser.given_name} {logItem.createdByUser.family_name}</span>
                        )
                      
                      }
                    </span>
                    <span className={date}> {moment(logItem.createdAt).format('lll')}</span>
                    <span className={date}> ({moment(logItem.createdAt).fromNow()})</span>
                  </div>

                  <div className={
                      classnames(
                        log_feed_text,
                        logItem.dataPairs[0].key === 'SUBJECTIVE_SCORE'
                        ? log_feed_type_SUBJECTIVE_SCORE : ''
                      )
                    }>
                    {logItem.dataPairs[0].val}
                  </div>



                  {
                    (logItem.createdAt !== logItem.updatedAt) && (
                      <div className={log_item_edited}>(edited)</div>
                    )
                  }

                </div>
              ))
            }

          </div>



          <Mutation mutation={logPut}>
            {(mutate, { data, loading, error }) => {

              return (
                <div className={input_form}>
                  <div 
                    className={event_toggle_button}
                    onClick={toggleHideEvents}>
                    {hideEvents ? 'show events' : 'hide events'}
                  </div>                
                  <form onSubmit={e => {
                    e.preventDefault()
                    if (this.state.value.length < 1) return;

                    let variables = {
                      connectionId,
                      input: {
                        logType: "COMMENT",
                        dataPairs: [{
                          key: "TEXT",
                          val: this.state.value
                        }]
                      }
                    }

                    mutate(
                      {
                        variables,
                        update: (proxy, { data: { logPut } }) => {
                          let data = proxy.readQuery({
                            query: logGet,
                            variables: { connectionId }
                          })
                          data.logGet.push(logPut)
                        }
                      }
                    )

                    this.setState({value: ''})

                  }}>
                    <textarea
                      onChange={e => {
                        this.setState({value: e.target.value})
                      }}
                      placeholder="Write a comment"
                      value={this.state.value}
                      rows="4"
                    />
                    <input
                      type="submit"
                      value={loading ? "... submitting" : "Submit"}
                      className={(this.state.value.length <= 0) ? not_ready : ''}
                    />
                  </form>
                </div>
              )
            }}
          </Mutation>
        </div>

      </div>
    )
  }
}





class ComposedComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hideEvents: true      
    }
  }

  render() {

    const { connectionId, user } = this.props;

    const Composed = adopt({
      logQuery: ({ render }) => (
        <Query
          query={logGet}
          variables={{connectionId}}
        >{render}</Query>
      )
    });

    return (
      <Composed>
        {({logQuery}) => {

          const loading = logQuery.loading;
          const error = logQuery.error;
          const log = logQuery.data.logGet;

          return (
            <LogBox
              error={error}
              loading={loading}
              connectionId={connectionId}
              log={log}
              user={user}
              hideEvents={this.state.hideEvents}
              toggleHideEvents={() => {
                this.setState({hideEvents: !this.state.hideEvents})
              }}
            />
          );
        }}
      </Composed>
    );
  }

}


export default ComposedComponent;











