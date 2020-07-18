import React from 'react';
import classnames from 'classnames';
import { container } from './GhostLoader.module.css';
import { color1 } from './Colors.module.css';

export const GhostLoader = () => (
  <div className={classnames(container, color1)}>
    <i className="fal fa-spinner fa-spin" />
  </div>
)