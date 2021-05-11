import React, { useState } from "react";
import styles from "./table.module.css";
import { startup_page } from "definitions";
import TableBody from "./tableBody";
import TableHeader from "./tableHeader";

export default function Table(props) {
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
    columnSettings,
  } = props;

  const [preview, setPreview] = useState();

  const showPreview = no => {
    setPreview(no);
  };

  const hidePreview = ({ no }) => {
    setPreview(null);
  };

  const ButtonGreen = () => (
    <button className={styles.buttongreen}>
      <i className="fas fa-plus-circle"></i>
    </button>
  );

  const handleCompany = connection => {
    history.push(`${startup_page}/components/ui/navigation1/${connection.id}`);
    // `${startup_page}/${connection.id}`);
  };

  return (
    <div className={styles.tableOuterWrapper}>
      <div className={styles.tableWrapper}>
        <table className={styles.startupTable}>
          <TableHeader
            {...props}
            handleCompany={handleCompany}
            ButtonGreen={ButtonGreen}
            showPreview={showPreview}
            preview={preview}
            hidePreview={hidePreview}
          />
          <TableBody
            {...props}
            handleCompany={handleCompany}
            ButtonGreen={ButtonGreen}
            showPreview={showPreview}
            preview={preview}
            hidePreview={hidePreview}
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
  );
}
