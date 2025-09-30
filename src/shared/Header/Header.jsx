import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

/**
 * @param {object} props 
 * @param {string} props.title 
 */
function Header({ title }) {
  return (
    <header className={styles.appHeader}> {}
      <h1 className={styles.headerTitle}>{title}</h1> {}
      <nav className={styles.headerNav}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : styles.inactive)} 
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? styles.active : styles.inactive)} 
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
