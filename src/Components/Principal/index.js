import styles from "./Principal.module.css";

export default function Principal() {
  return (
    <header className={styles.cabecalho}>
      <div>
        <a href="http://localhost:3001/">
          <img src="./assets/Logo.png" alt="Icone Logo" />
        </a>
      </div>

      <nav>
        <ul>
          <li>
            {/* <a href="#">Home</a> */}
          </li>
          <li>
            {/* <a href="#">About</a> */}
          </li>
          <li>
            {/* <a href="#">Services</a> */}
          </li>
          <li>
            {/* <a href="#">Contact</a> */}
          </li>
        </ul>
      </nav>
    </header>
  );
}
