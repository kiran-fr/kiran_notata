import React, {useState} from 'react';
import styles from './table.module.css';
import { startup_page } from "definitions";
import TableCellData from "./tableCellData"
import Red from "../../assets/images/red.png";
import Green from "../../assets/images/green.png";
import moment from "moment";
//Helper
import InvisiblePlus from "../../assets/images/InvisiblePlus.svg";
import { subjectiveScore } from "private/pages/Dashboard/Connections/types";

export default function Table(props) {

  const StartupPreview = ({ no, companyName, oneLiner, problem }) => (
    <div
      className={styles.startupPreview}
      style={{ top: `${100 + 56 * no}px` }}
    >
      <h1>{companyName}</h1>
      {oneLiner && (
        <>
          <h3>{oneLiner.questionName}</h3>
          <p>{oneLiner.val}</p>
        </>
      )}
      {problem && (
        <>
          <h3>{problem.questionName}</h3>
          <p>{problem.val}</p>
        </>
      )}
    </div>
  );

  const {
    data,
    evaluationTemplates,
    loading,
    emptyLabel,
    history,
    filters,
    setFilters,
    setShowTagGroupForId,
    setShowFunnelScoreForId,
    setShowSubjectiveScoreForId,
    columnSettings
  } = props;


  console.log('datavalue', props.data)
  const [preview, setPreview] = useState()




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
              <td>
                COMPANY NAME{" "}
                <i
                  className="fal fa-exchange"
                  onClick={() => {

                    let sortBy = "ALPHA";
                    let sortDirection = filters.sortBy === "ALPHA" ? "DESC" : "ASC"

                    setFilters({
                      ...filters,
                      sortBy,
                      sortDirection
                    })

                  }}
                />
              </td>
              <td>Groups <i 
              onClick={() => {

                let sortBy = "GROUP";
                let sortDirection = filters.sortBy === "GROUP" ? "DESC" : "ASC"

                setFilters({
                  ...filters,
                  sortBy,
                  sortDirection
                })

              }}
              className="fal fa-exchange" /></td>
              <td>FUNNEL STAGE <i 
               onClick={() => {

                let sortBy = "FUNNEL";
                let sortDirection = filters.sortBy === "FUNNEL" ? "DESC" : "ASC"

                setFilters({
                  ...filters,
                  sortBy,
                  sortDirection
                })

              }}
              
              className="fal fa-exchange" /></td>
              <td>TAGS <i 
              onClick={() => {

                let sortBy = "TAGS";
                let sortDirection = filters.sortBy === "TAGS" ? "DESC" : "ASC"

                setFilters({
                  ...filters,
                  sortBy,
                  sortDirection
                })

              }}
              
              className="fal fa-exchange" /></td>
              <td>SUBJECTIVE SCORE <i 
              onClick={() => {

                let sortBy = "SUBJECTIVE_SCORE";
                let sortDirection = filters.sortBy === "SUBJECTIVE_SCORE" ? "DESC" : "ASC"

                setFilters({
                  ...filters,
                  sortBy,
                  sortDirection
                })

              }}
              
              className="fal fa-exchange" /></td>
              <td>UPDATED <i 
              onClick={() => {

                let sortBy = "UPDATED_AT";
                let sortDirection = filters.sortBy === "UPDATED_AT" ? "DESC" : "ASC"

                setFilters({
                  ...filters,
                  sortBy,
                  sortDirection
                })

              }}
              
              className="fal fa-exchange" /></td>
              {evaluationTemplates.length &&
              (
                evaluationTemplates.map(({ name }) =>
                  (
                    <td>{name} <i 
                    onClick={() => {

                      let sortBy = "EVALUATION";
                      let sortDirection = filters.sortBy === "EVALUATION" ? "DESC" : "ASC"
      
                      setFilters({
                        ...filters,
                        sortBy,
                        sortDirection
                      })
      
                    }}
                    
                    className="fal fa-exchange" /></td>
                  )
              )
              )}

            </tr>
          </thead>
          <tbody>
          {
            data &&
            data
              .filter(({creative}) => creative)
              .map((item, index) => {

            let { funnelTags, creative, subjectiveScores,groupSharingInfo, evaluationSummaries } = item;


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
            // console.log("subjectiveScoreValAvg", subjectiveScoreValAvg)


            //  Company one-liner
            let oneLiner  = ""
            // Problem
            let problem = ""

            // popover oneLiner
            if (creative.answers) {
              oneLiner = creative.answers.find(({ questionId }) => questionId === 'q01_section_info');
              problem = creative.answers.find(({ questionId }) => questionId === 'q02_section_info')
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
                        <StartupPreview
                          companyName={item.creative.name}
                          oneLiner={oneLiner}
                          problem={problem}
                          no={index}
                        />
                    }

                  </span>

                </td>

                {
                  columnSettings.groups && (
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
                  )
                }


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

                    {
                      // !item.tags?.length && (
                      <li onClick = {()=>setShowTagGroupForId(item.id)} >
                        <ButtonGreen/>
                      </li>
                    // )
                    }


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



                {/* Iterate over the headers */}


                {/*{uniqEvaluationHeader && uniqEvaluationHeader.map((headerData) => {*/}

                {

                  evaluationTemplates
                    .filter(({id}) =>
                      (columnSettings.evaluationTemplates || []).some(etID => etID === id)
                    )
                    .map(evaluationTemplate => {

                  // Find evaluation summary matching header
                  let summary;
                  if (evaluationSummaries.length) {
                    summary = evaluationSummaries.find(({templateId}) => templateId === evaluationTemplate.id);
                  }

                  return (
                    <td key={evaluationTemplate.id} >
                      {
                        summary
                          // If summary exists, display it
                          ? <span>{summary.averagePercentageScore}%</span>
                          // If not, display a plus button
                          : <img src={InvisiblePlus}/>
                      }
                  </td>
                  )
                }

                )}

              </tr>
            )
          })}
          </tbody>
          {/* <TableCellData {...props} 
            handleCompany = {handleCompany}
            ButtonGreen = {ButtonGreen}
            showPreview = {showPreview}
            preview = {preview}
            hidePreview = {hidePreview}
          /> */}
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
    </div>
  )
}