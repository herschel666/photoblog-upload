import React from 'react';

import styles from './loading-bar.module.css';

export type LoadingState = 10 | 20 | 30 | 40 | 50;

interface Props {
  value?: LoadingState;
}

export const getLabel = (loadingState: LoadingState) => {
  switch (loadingState) {
    case 10:
      return 'Preparing the environment…';
    case 20:
      return 'Uploading the image…';
    case 30:
      return 'Publishing the image…';
    case 40:
      return 'Uploading the entry…';
    case 50:
      return 'Publishing the entry…';
    default:
      return '';
  }
};

export const LoadingBar: React.SFC<Props> = ({ value }) => {
  if (value === undefined) {
    return null;
  }

  return (
    <fieldset className={styles.fieldset} data-testid="progress">
      <legend className={styles.legend}>{getLabel(value)}</legend>
      <progress className="nes-progress is-primary" value={value} max={50} />
    </fieldset>
  );
};
