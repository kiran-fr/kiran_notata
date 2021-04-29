import React, {useState} from 'react';
import styles from './table.module.css';
import TagSelect from '../../private/NewDesign/Dashboard/Connections/DealFlow/modal';
import Red from '../../assets/images/red.png';
import Green from '../../assets/images/green.png';
import Imag from '../../assets/images/struplog.png';

export default function Table(props) {
    const [preview, setPreview] = useState()

    const StartupPreview = ({no}) => (
        <div className={styles.startupPreview} style={{top:`${95 + ( 56 * no)}px`}}>
            <h1>Great Startup Inc</h1>
            <h3>Company One-liner</h3>
            <p>Great Startup is a simple tool for investors to evaluate startups and engage their network
            </p>
            <h3>Problem</h3>
            <p>It's hard to avoid unconscious bias when investing in early stage startups. A systematic approach to evaluate companies has proven to increase the return of investment. Most online platforms are focused on startups, while tools for investors are often complicated, expensive and lack sharing capabilites. Entering the market as a new investor is difficult without open access to a network. Notata is the only tool which offers deal flow management, collaboration and sharing between investors.</p>
        </div>
    )

    const showPreview = (no) => {
        console.log(no)
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

    return (
        <div className={styles.tableOuterWrapper}>
            <div className={styles.tableWrapper}>
                <table className={styles.startupTable}>
                    <thead>
                        <tr>
                            <td>
                                <label className={styles.customCheck} style={{ top: '-8px' }}>
                                    <input type="checkbox" />
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
                            <td>AFTER <br /> PITCHING <i className="fal fa-exchange" /></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <label className={styles.customCheck}>
                                    <input type="checkbox" />
                                    <span class={styles.checkmark}></span>
                                </label>
                                <div className={styles.favStartup}> <i class="fas fa-star"></i></div>
                            </td>
                            <td onMouseOver={()=> showPreview(0)} onMouseLeave={hidePreview}> <img src={Imag} /> Great Startup Inc
                            {
                                preview === 0 && <StartupPreview no={0} />
                            }
                            </td>
                            <td>Group1, Big Group 2 <ButtonGreen /> </td>
                            <td>
                                <div className={styles.startupStatus}>
                                    <img src={Red} /> Reviewed <span><i class="fas fa-chevron-down"></i></span>
                                </div>
                            </td>
                            <td>
                                <ul>
                                    <li><span>MedTech</span></li>
                                    <li><span>OceanTech</span> ...</li>
                                    <li><ButtonGreen /></li>
                                </ul>
                            </td>
                            <td><ButtonGreen /></td>
                            <td><span className={styles.olderThan}>Older than 2 month</span></td>
                            <td>65% <span> <i className="fas fa-pen"></i></span></td>
                            <td>65% <span> <i className="fas fa-pen"></i></span></td>
                        </tr>
                        <tr>
                            <td>
                                <label className={styles.customCheck}>
                                    <input type="checkbox" />
                                    <span class={styles.checkmark}></span>
                                </label>
                                <div className={styles.favStartup}> <i class="fas fa-star"></i></div>
                            </td>
                            <td onMouseOver={()=> showPreview(1)} onMouseLeave={hidePreview}> <img src={Imag} /> Great Startup Inc 
                            {
                                preview === 1 && <StartupPreview no={1} />
                            }
                            </td>
                            <td>Group1, Big Group 2 <ButtonGreen /> </td>
                            <td>
                                <div className={styles.startupStatus}>
                                    <img src={Green} /> Met <span><i class="fas fa-chevron-down"></i></span>
                                </div>
                            </td>
                            <td>
                                <ul>
                                    <li><span>MedTech</span> <span>MedTech</span> ...</li>
                                    <li><ButtonGreen /></li>
                                </ul>
                            </td>
                            <td>8,5 <span> <i className="fas fa-pen"></i></span></td>
                            <td>Jan 25, 2020</td>
                            <td><ButtonGreen /></td>
                            <td>65% <span> <i className="fas fa-pen"></i></span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
                            <TagSelect title="Add Tags" value={true} ></TagSelect>
        </div>
    )
}