"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();

  return (
    <>
      <h1>TNP Arcade</h1>
      <p>Choose a game!</p>

      <button onClick={() => router.push('/fidget-popper')}>Fidget Popper</button>
      
    </>
  );
}
