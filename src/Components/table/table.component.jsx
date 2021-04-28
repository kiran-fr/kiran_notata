import React from 'react';
import styles from './table.module.css';
import moment from "moment";
import {
    highestFunnelTagIndex,
    subjectiveScore,
    tagCount,
  } from "private/pages/Dashboard/Connections/types";

export default function Table(props) {

    const { data } = props

    const ButtonGreen = () => (
        <button className={styles.buttongreen} >
            <i className="fas fa-plus-circle"></i>
        </button>
    )

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.startupTable}>
                <thead>
                    <tr>
                        <td>
                            <label className={styles.customCheck} style={{top:'-8px'}}>
                                <input  type="checkbox" />
                                <span className={styles.checkmark}></span>
                            </label> 
                        </td>
                        <td>COMPANY NAME <i className="fal fa-exchange" /></td>
                        <td>Groups <i className="fal fa-exchange" /></td>
                        <td>FUNNEL STAGE <i className="fal fa-exchange" /></td>
                        <td>TAGS <i className="fal fa-exchange" /></td>
                        <td>SUBJECTIVE SCORE <i className="fal fa-exchange" /></td>
                        <td>UPDATED <i className="fal fa-exchange" /></td>
                        <td>LAST EVALUATION (AVERAGE) <i className="fal fa-exchange" /></td>
                        <td>AFTER <br/> PITCHING <i className="fal fa-exchange" /></td>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item, index) => {
                        
                        let { funnelTags } = item;

                        let tagSet;
                        if (funnelTags.length) {
                          let highest = funnelTags.reduce(
                            (max, tag) => (tag.index > max ? tag.index : max),
                            funnelTags[0].index
                          );
                          tagSet = funnelTags.find(({ index }) => index === highest);
                        }

                        return (
                            <>
                                <tr>
                                    <td> 
                                        <label className={styles.customCheck}>
                                            <input  type="checkbox" />
                                            <span className={styles.checkmark}></span>
                                        </label> 
                                        <div className={styles.favStartup}> <i className="fas fa-star"></i></div>
                                    </td>
                                    <td> 
                                        <div className={styles.user_profile_Img}>
                                            {item.creative.name.charAt(0).toUpperCase()}
                                        </div>
                                        {item.creative.name} 
                                    </td>
                                    <td>Group1, Big Group 2 <ButtonGreen /> </td>
                                    <td>
                                        {tagSet && tagSet.name} {!tagSet && <ButtonGreen />}
                                    </td>
                                    <td>
                                        <ul>
                                            {(item.tags || []).slice(0, 3).map(({ name, id, group }) => 
                                                (
                                                    <li><span>{group.name}: {name}</span></li>
                                                )
                                            )}
                                            <li><ButtonGreen/></li>
                                        </ul>
                                    </td>
                                    <td>
                                        {subjectiveScore(item)}
                                        {!subjectiveScore(item) && <ButtonGreen/> }
                                    </td>
                                    <td>
                                        <span className={styles.olderThan}>
                                            {moment(item.updatedAt).format("ll")}
                                        </span>
                                    </td>
                                    <td>65% <span> <i className="fas fa-pen"></i></span></td>
                                    <td>65% <span> <i className="fas fa-pen"></i></span></td>
                                </tr>
                            </>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}