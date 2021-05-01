import React, {useState} from 'react';
import styles from './table.module.css';
import { startup_page } from "definitions";
import TagSelect from '../../private/NewDesign/Main/Connections/DealFlow/modal';
import Red from '../../assets/images/red.png';
import Green from '../../assets/images/green.png';
import Imag from '../../assets/images/struplog.png';
import moment from "moment";
import {
    subjectiveScore,
  } from "private/pages/Dashboard/Connections/types";

export default function Table(props) {
    const [preview, setPreview] = useState()
    const [openTag, setOpenTag] = useState(false)


    const StartupPreview = ({no}) => (
        <div className={styles.startupPreview} style={{top: `${100 + (56 * no)}px`}}>
            <h1>Great Startup Inc</h1>
            <h3>Company One-liner</h3>
            <p>Great Startup is a simple tool for investors to evaluate startups and engage their network
            </p>
            <h3>Problem</h3>
            <p>It's hard to avoid unconscious bias when investing in early stage startups. A systematic approach to evaluate companies has proven to increase the return of investment. Most online platforms are focused on startups, while tools for investors are often complicated, expensive and lack sharing capabilites. Entering the market as a new investor is difficult without open access to a network. Notata is the only tool which offers deal flow management, collaboration and sharing between investors.</p>
        </div>
    )

    const { data, loading, emptyLabel, history } = props

    const handleTagModal = () => {
        setOpenTag(!openTag)
    }

    const showPreview = (no) => {
        setPreview(no)
    }
    const hidePreview = ({no}) => {
        setPreview(null)
    }
    const ButtonGreen = () => (
        <button className={styles.buttongreen} >
            <i className="fas fa-plus-circle"></i>
        </button>
    )

    const handleCompany = (connection) => {
        history.push(`${startup_page}/${connection.id}`)
    }


    return (
        <div className={styles.tableOuterWrapper}>
            <div className={styles.tableWrapper}>
                <table className={styles.startupTable}>
                    <thead>
                        <tr>
                            <td>
                                <label className={styles.customCheck} style={{ top: '-8px' }}>
                                    <input type="checkbox" />
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
                            <td>AFTER <br /> PITCHING <i className="fal fa-exchange" /></td>
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
                                <tr key = {index}>
                                    <td>
                                        <label className={styles.customCheck}>
                                            <input type="checkbox" />
                                            <span className={styles.checkmark}></span>
                                        </label>
                                        <div className={styles.favStartup}> <i className="fas fa-star"></i></div>
                                    </td>
                                    <td> 
                                        <div onMouseOver={()=> showPreview(index)} onMouseLeave={hidePreview} className={styles.user_profile_Img}>
                                            {item.creative.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span onMouseOver={()=> showPreview(index)} onMouseLeave={hidePreview} className={styles.company_name} onClick = {()=>handleCompany(item)}>
                                            {item.creative.name}
                                            {
                                            preview === index &&
                                             <StartupPreview no={index} />
                                            }
                                        </span>
                                        
                                        
                                    </td>
                                    
                                    <td>Group1, Big Group 2 <ButtonGreen /> </td>
                                    <td>
                                        <div className={styles.startupStatus}>
                                            {tagSet
                                                ?
                                                    <>
                                                        <img src={
                                                            `${(tagSet.name).toUpperCase()}` === "ANALYZED" ?
                                                            Red : Green
                                                            } 
                                                        />
                                                        {tagSet.name} 
                                                        <span>
                                                            <i className="fas fa-chevron-down"></i>
                                                        </span>
                                                    </>
                                                : 
                                                    <ButtonGreen />
                                            }
                                            
                                        </div>
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
                                        {subjectiveScore(item) && <span> <i className="fas fa-pen"></i></span>}
                                    </td>
                                    <td>
                                        <span className={styles.olderThan}>
                                            {moment(item.updatedAt).format("ll")}
                                        </span>
                                    </td>
                                    <td>65% <span> <i className="fas fa-pen"></i></span></td>
                                    <td>65% <span> <i className="fas fa-pen"></i></span></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {loading && (
                    <div className={styles.loader}>
                    <i className={"fa fa-spinner fa-spin"} />
                    </div>
                )}

                {!data.length && (
                    <div className={styles.empty_list}>
                    {emptyLabel || "This list is empty"}
                    </div>
                )}
            </div>
            <TagSelect title="Add Tags" value={openTag} ></TagSelect>
        </div>
    )
}