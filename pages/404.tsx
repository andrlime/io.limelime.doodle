/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Q.module.css';

const P404: NextPage = () => {
  const [locationX, setLocationX] = useState(100);
  const [locationY, setLocationY] = useState(100);
  let [speedX, speedY] = [0.005, 0.005];

  useEffect(() => {
    const [height, width] = [window.innerHeight, window.innerWidth];
    speedX += (Math.random()-0.5)/10;
    speedY += (Math.random()-0.5)/10;
    setLocationX(locationX+speedX);
    setLocationY(locationY+speedY);

    if(locationX > width || locationX < 0) {
      setLocationX(0);
    }
    
    if(locationY > height || locationY < 0) {
      setLocationY(0);
    }
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>404! Page not found.</title>
        <link rel="icon" type="image/x-icon" href="/icon.png"/>
      </Head>
      
      <div className={styles.four} style={{"top": locationY, "left": locationX}}><span>404</span></div>
    </div>
  );
};

export default P404;
