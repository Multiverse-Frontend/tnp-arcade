// app/page.tsx
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>TNP Arcade</h1>
      <p>Choose a game!</p>
      <div className={styles.buttonContainer}>
        <Link href="/memoryGame" className={styles.button}>
          Memory Game
        </Link>
        <Link href="/another-game" className={styles.button}>
          Another Game
        </Link>
        <Link href="/third-game" className={styles.button}>
          Third Game
        </Link>
      </div>
    </div>
  );
}