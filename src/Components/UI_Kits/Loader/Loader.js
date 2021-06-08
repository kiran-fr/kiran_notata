import React from "react";
import "./Loader.scss";

export const Loader = props => {
    let size = props.size
    let top = props.marginTop ? true :false
    return (
        <div className=
            {
                size === "large"
                ? 
                    "green_spinner_loader loaderLarge"
                :
                    size === "medium"
                        ?
                            "green_spinner_loader loaderMedium"
                        :
                            "green_spinner_loader loaderSmall"
                
              
            } 
        >
            <i className=
                {
                size === "large"
                ? 
                    "fa fa-spinner fa-spin loaderLarge"
                :
                    size === "medium"
                        ?
                            "fa fa-spinner fa-spin loaderMedium"
                        :
                            "fa fa-spinner fa-spin loaderSmall"
            
                } 
            />
        </div>
    )
};
