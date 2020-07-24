import React from "react";
import classnames from "classnames";
import {
  input_text,
  web_box,
  web_title,
  web_image,
  web_provider,
  delete_link
} from "./Form.module.css";
import { color3 } from "./Colors.module.css";
import { Query } from "@apollo/client/react/components";
import { getPageMeta } from "../../Apollo/Queries";

class InputUrls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: "Paste URL please",
      fetchData: false
    };
  }
  render() {
    let { onChange, val, save, setData, deleteLink } = this.props;
    let { url, provider, title, image } = val;

    // We have data stored in databasee
    if (url && title && provider) {
      return (
        <div>
          <div className={delete_link} onClick={deleteLink}>
            delete
          </div>
          <a
            style={{ textDecoration: "none", color: "inherit" }}
            href={url}
            target="_blank"
          >
            <div className={web_box} style={{ marginBottom: "10px" }}>
              <div className={web_title}>
                <div className={classnames(web_provider, color3)}>
                  {provider}
                </div>
                {title}
              </div>
              <div className={web_image}>
                <img src={image} />
              </div>
            </div>
          </a>
        </div>
      );
    }

    // We just fetched data from database
    return (
      <Query
        query={getPageMeta}
        variables={{ url }}
        skip={!this.state.fetchData}
      >
        {({ loading, data, error }) => {
          if (
            this.state.fetchData &&
            !error &&
            !loading &&
            data &&
            data.getPageMeta &&
            data.getPageMeta !== val
          ) {
            let saveItem = {};
            let { url, provider, title, image } = data.getPageMeta;
            if (url) saveItem.url = url;
            if (provider) saveItem.provider = provider;
            if (title) saveItem.title = title;
            if (image) saveItem.image = image;
            if (title) setData(saveItem);
            this.setState({ fetchData: false });
          }

          return (
            <div>
              {url && (
                <div className={delete_link} onClick={deleteLink}>
                  delete
                </div>
              )}

              <input
                type="text"
                className={input_text}
                placeholder={this.state.placeholder}
                onChange={e => onChange({ url: e.target.value })}
                onFocus={() =>
                  this.setState({ placeholder: "", fetchData: true })
                }
                onBlur={() => {
                  this.setState({ placeholder: "Paste URL please" });
                  if (url && url !== "") save();
                }}
                value={url || ""}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default InputUrls;
