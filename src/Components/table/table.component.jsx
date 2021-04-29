import React from 'react';
import styles from './table.module.css';
import Imag from '../../assets/images/struplog.png';

export default function Table() {

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
                                <span class={styles.checkmark}></span>
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
                    <tr>
                        <td> 
                            <label className={styles.customCheck}>
                                <input  type="checkbox" />
                                <span class={styles.checkmark}></span>
                            </label> 
                            <div className={styles.favStartup}> <i class="fas fa-star"></i></div>
                        </td>
                        <td> <img src={Imag} /> Great Startup Inc</td>
                        <td>Group1, Big Group 2 <ButtonGreen /> </td>
                        <td>kjkjk</td>
                        <td>
                            <ul>
                                <li><span>MedTech</span></li>
                                <li><span>OceanTech</span> ...</li>
                                <li><ButtonGreen/></li>
                            </ul>
                        </td>
                        <td><ButtonGreen/></td>
                        <td><span className={styles.olderThan}>Older than 2 month</span></td>
                        <td>65% <span> <i className="fas fa-pen"></i></span></td>
                        <td>65% <span> <i className="fas fa-pen"></i></span></td>
                    </tr>
                    <tr>
                        <td>
                            <label className={styles.customCheck}>
                                <input  type="checkbox" />
                                <span class={styles.checkmark}></span>
                            </label> 
                            <div className={styles.favStartup}> <i class="fas fa-star"></i></div>
                        </td>
                        <td> <img src={Imag} /> Great Startup Inc</td>
                        <td>Group1, Big Group 2 <ButtonGreen /> </td>
                        <td>kjkjk</td>
                        <td>
                            <ul>
                                <li><span>MedTech</span> <span>MedTech</span> ...</li>
                                <li><ButtonGreen/></li>
                            </ul>
                        </td>
                        <td>8,5 <span> <i className="fas fa-pen"></i></span></td>
                        <td>Jan 25, 2020</td>
                        <td><ButtonGreen/></td>
                        <td>65% <span> <i className="fas fa-pen"></i></span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}