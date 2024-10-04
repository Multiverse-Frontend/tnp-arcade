import Image from "next/image";
import styles from "./page.module.css";

import SelectPopper from "./fidget-popper/page";

export default function Home() {
  return (
    <>
      <h1>TNP Arcade</h1>
      <p>Choose a game!</p>

      <SelectPopper />
    </>
  );
}
