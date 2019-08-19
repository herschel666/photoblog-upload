import React from 'react';

import styles from './layout.module.css';

export const Layout: React.SFC = ({ children }) => (
  <>
    <header className={styles.header}>
      <form method="post" action="/logout" className={styles.form}>
        <button className="nes-btn" name="logout">
          Logout
        </button>
      </form>
    </header>
    <main className={styles.main}>{children}</main>
  </>
);
