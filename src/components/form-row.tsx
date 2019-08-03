import React from 'react';
import classNames from 'classnames';

import styles from './form-row.module.css';

interface Props {
  id: string;
  label: string;
}

export const FormRow: React.SFC<Props> = ({ id, label, children }) => (
  <div className={classNames(styles.row, 'nes-field')}>
    <label htmlFor={id}>{label}</label>
    {children}
  </div>
);
