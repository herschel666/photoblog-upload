import React from 'react';

import styles from './layout.module.css';

export const Layout: React.SFC = ({ children }) => (
  <main className={styles.main}>{children}</main>
);
