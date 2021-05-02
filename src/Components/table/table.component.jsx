import React, {useState} from 'react';
import styles from './table.module.css';
import { startup_page } from "definitions";
import TagSelect from '../../private/NewDesign/Main/Connections/DealFlow/modal';
import Red from '../../assets/images/red.png';
import Green from '../../assets/images/green.png';
import Imag from '../../assets/images/struplog.png';
import moment from "moment";
//Helper
import uniqBy from "lodash/uniqBy";
import InvisiblePlus from "../../assets/images/InvisiblePlus.svg"
import {

    Button

  } from "Components/UI_Kits";
import {
    subjectiveScore,
  } from "private/pages/Dashboard/Connections/types";
import { upperCase } from 'lodash';

export default function Table(props) {
    const [preview, setPreview] = useState()
    const [openTag, setOpenTag] = useState(false)


    const StartupPreview = ({no, companyName, oneLiner, problem}) => (
        <div className={styles.startupPreview} style={{top: `${100 + (56 * no)}px`}}>

         
            <h1>
                
                {companyName}</h1>

            {oneLiner &&
            <>
                <h3>{oneLiner.questionName}</h3>
                <p>
                    {oneLiner.val}
                </p>
            </>
            }
            {problem &&
                <>
                    <h3>{problem.questionName}</h3>
                    <p>{problem.val}</p>
                </>
            }
            
        </div>
    )

    const { data, loading, emptyLabel, history, setShowTagGroupForId, setShowFunnelScoreForId, setShowSubjectiveScoreForId} = props

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

    let dynamicHeader = []

    {data && data.map((item, index) => {
        
        {item.evaluationSummaries && item.evaluationSummaries.map((item1, index) => {
            dynamicHeader.push(item1.templateName);
        })}
    })}


    let uniqEvaluationHeader = uniqBy(dynamicHeader)

    
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
                            {uniqEvaluationHeader.length && 
                                (
                                    uniqEvaluationHeader.map((header) => 
                                        (
                                            <td>{header} <i className="fal fa-exchange" /></td>
                                        )
                                    )
                                )          
                             }
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((item, index) => {
                        
                        let { funnelTags, creative, subjectiveScores,groupSharingInfo, evaluationSummaries } = item;
                         //  Company one-liner
                         let oneLiner  = ""
                         // Problem
                         let problem = ""


                        let tagSet;
                        if (funnelTags.length) {
                          let highest = funnelTags.reduce(
                            (max, tag) => (tag.index > max ? tag.index : max),
                            funnelTags[0].index
                          );
                          tagSet = funnelTags.find(({ index }) => index === highest);
                        }

                        // subjective score (took the last index of array)

                        let subjectiveScoreValAvg = subjectiveScore(item);
                        console.log("subjectiveScoreValAvg", subjectiveScoreValAvg)


                        // popover oneLiner
                        if(creative.answers) {
                            oneLiner = creative.answers.find(question => question.questionId === 'q01_section_info');
                            problem = creative.answers.find((question) => question.questionId === 'q02_section_info')
                        }
                       
                        
                        // popover problem

                        return (
                                <tr key = {index}>
                                    <td>
                                        <label className={styles.customCheck}>
                                            <input type="checkbox" />
                                            <span className={styles.checkmark}></span>
                                        </label>
                                        <div className={styles.favStartup}
                                         /* onClick={() => {
                                            setStarMutation({
                                              variables: { id },
                              
                                              optimisticResponse: {
                                                __typename: "Mutation",
                                                connectionSetStar: {
                                                  ...connection,
                                                  starred: !starred,
                                                },
                                              },
                                            });
                                          }} */> <i className="fas fa-star"></i></div>
                                    </td>
                                    <td> 
                                        <div onMouseOver={()=> showPreview(index)} onMouseLeave={hidePreview} className={styles.user_profile_Img}>
                                            {item.creative.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span onMouseOver={()=> showPreview(index)} onMouseLeave={hidePreview} className={styles.company_name} onClick = {()=>handleCompany(item)}>
                                            {item.creative.name}
                                            {
                                            preview === index &&
                                             <StartupPreview companyName = {item.creative.name} oneLiner = {oneLiner}  problem = {problem} no={index} />
                                            }
                                        </span>
                                    </td>
                                    <td>
                                
                                        <ul>
                                           
                                        {(groupSharingInfo || []).slice(0, 3).map(({ group }) => 
                                                (
                                                    <li >
                                                        
                                                            {group.name}
                                                        
                                                    </li>
                                                )
                                            )}

                                 {/*    // {( groupSharingInfo.group|| []).slice(0, 3).map((itemvalue) => 
                                                
                                    //             {console.log("itemvalue", itemvalue)},
                                            
                                    //             <li><span>{itemvalue.name}</span></li> 
                                               
                                    //     )} */}
                                            
                                            <li><img src={InvisiblePlus}/></li>
                                        </ul>
                                        
                                    </td>
                                     <td>
                                        <div className={styles.startupStatus}>
                                            {tagSet
                                                ?
                                                    <>
                                                        <img  onClick = {() =>setShowFunnelScoreForId(item.id)} src={
                                                            `${(tagSet.name).toUpperCase()}` === "ANALYZED" ?
                                                            Red : Green
                                                            } 
                                                        />
                                                        {tagSet.name} 
                                                        <span  onClick = {() =>setShowFunnelScoreForId(item.id)}>
                                                            <i className="fas fa-chevron-down"></i>
                                                        </span>
                                                    </>
                                                : 
                                                <span onClick = {() =>setShowFunnelScoreForId(item.id)}><ButtonGreen/></span>    
                                            }
                                            
                                        </div>
                                    </td>
                                    <td>
                                        <ul>
                                            {(item.tags || []).slice(0, 2).map(({ name, id, group }) => 
                                                (
                                                    <li key ={id}>
                                                        <span>
                                                            {group.name}: {name}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                            <li onClick = {()=>setShowTagGroupForId(item.id)} ><ButtonGreen/></li>
                                        </ul>
                                    </td>
                                    <td>
                                        {subjectiveScoreValAvg}
                                        {!subjectiveScoreValAvg && <span onClick = {() =>setShowSubjectiveScoreForId(item.id)}><ButtonGreen /> </span>}
                                        {subjectiveScoreValAvg && 
                                            <span onClick = {() =>setShowSubjectiveScoreForId(item.id)}> 
                                                <i className="fas fa-pen" />
                                            </span>
                                        }
                                    </td>
                                    <td>
                                        <span className={styles.olderThan}>
                                            {moment(item.updatedAt).format("ll")}
                                        </span>
                                    </td>
                                    {uniqEvaluationHeader && uniqEvaluationHeader.map((headerData, index) => 
                                        <td key = {headerData} >
                                            {evaluationSummaries.length 
                                                ? 
                                                    evaluationSummaries.map(summaries => 
                                                        <span> 
                                                            {summaries.templateName === headerData   
                                                            ? 
                                                                <>
                                                                    {summaries.averagePercentageScore}%
                                                                    
                                                                </> 

                                                            :  <img src={InvisiblePlus}/>
                                                            //  {uniqEvaluationHeader && uniqEvaluationHeader.map((headerData, index) => 
                                                                
                                                            //         <img src={InvisiblePlus}/>
                                                            
                                                                
                                                            //    )}
                                                            
                                                            
                                                            }

                                                        </span>
                                                    ) 
                                                : 
                                                    <span > <img src={InvisiblePlus}/> </span>
                                            }
                                        </td>
                                    )}

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