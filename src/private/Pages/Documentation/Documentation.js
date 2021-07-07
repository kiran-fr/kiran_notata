import React from "react";
import data from "./data";
import styles from "./Documentation.module.css";

export default function Documentation() {
  return (
    <div style={{ maxWidth: "700px", margin: "auto" }}>
      {data.map((d, i) => (
        <div className={styles.container} key={i}>
          <div className={styles.header}>
            <div className={styles.label}>Table name:</div>
            <div className={styles.table_name}>{d.tableName}</div>
          </div>

          <div className={styles.header}>
            <div className={styles.label}>Type name:</div>
            <div className={styles.table_name}>{d.typeName}</div>
          </div>

          <div className={styles.description}>{d.description}</div>

          <div className={styles.sub_header}>
            <div className={styles.label}>Key attributes:</div>
            {d.keyAttributes.map(attribute => (
              <div key={`${i}-${attribute}`} className={styles.sub_title}>
                {attribute}
              </div>
            ))}
          </div>

          <div className={styles.sub_header}>
            <div className={styles.label}>Key schema:</div>
            {d.keySchema.map(schema => (
              <div key={`${i}-${schema}`} className={styles.sub_title}>
                {schema}
              </div>
            ))}
          </div>

          {d.globalSecondaryIndexes.map((gsi, o) => (
            <div className={styles.sub_header} key={`${i}-${o}`}>
              <div className={styles.label}>Global Secondary Index:</div>
              <div className={styles.sub_title}>
                Index name: {gsi.indexName}
              </div>
              <div className={styles.sub_title}>
                Key schema: {gsi.keySchema}
              </div>
            </div>
          ))}

          <div className={styles.sub_header}>
            <div className={styles.label}>Related queries:</div>
            {d.relatedQueries.map(query => (
              <div key={`${i}-${query}`} className={styles.sub_title}>
                {query}
              </div>
            ))}
          </div>

          <div className={styles.sub_header}>
            <div className={styles.label}>Related sub queries:</div>
            {d.relatedSubQueries.map(query => (
              <div key={`${i}-${query}`} className={styles.sub_title}>
                {query}
              </div>
            ))}
          </div>
        </div>
      ))}

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
