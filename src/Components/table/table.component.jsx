import React, {useState} from 'react';
import styles from './table.module.css';
import { startup_page } from "definitions";
import TableCellData from "./tableCellData"

export default function Table(props) {

  const {
    data,
    evaluationTemplates,
    loading,
    emptyLabel,
    history,
    filters,
    setFilters
  } = props;

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
              <td>Groups <i className="fal fa-exchange" /></td>
              <td>FUNNEL STAGE <i className="fal fa-exchange" /></td>
              <td>TAGS <i className="fal fa-exchange" /></td>
              <td>SUBJECTIVE SCORE <i className="fal fa-exchange" /></td>
              <td>UPDATED <i className="fal fa-exchange" /></td>
              {evaluationTemplates.length &&
              (
                evaluationTemplates.map(({ name }) =>
                  (
                    <td>{name} <i className="fal fa-exchange" /></td>
                  )
                )
              )
              }
            </tr>
          </thead>
          <TableCellData {...props} 
            handleCompany = {handleCompany}
            ButtonGreen = {ButtonGreen}
            showPreview = {showPreview}
            preview = {preview}
            hidePreview = {hidePreview}
          />
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