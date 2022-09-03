import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'
import { useMutation, useQuery } from '../convex/_generated/react'

import GoogleMapReact from 'google-map-react';

// function SimpleMap() {
//   const defaultProps = {
//     center: {
//       lat: 10.99835602,
//       lng: 77.01502627
//     },
//     zoom: 11
//   };
// }

//Anthony Li is a menace to M&T and
// society
// an absolute menace
// thank you
// you're welcome
//Feta is a masterstroke of genius
const Home = () => {
  const sendMessage = useMutation("sendMessage");
  const [newMessageText, setNewMessageText] = useState("")

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setNewMessageText(""); // reset text entry box
    await sendMessage(newMessageText);
  }

  const cookieContaining = useQuery("listMessages", "cookie") || [];
  const all = useQuery("listMessages", "") || [];

  return (
    <div className={styles.container}>
      <Head>
        <title>Feta</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <form
          onSubmit={onSubmit}
          className="d-flex justify-content-center"
        >
          <input
            value={newMessageText}
            onChange={event => setNewMessageText(event.target.value)}
            className="form-control w-50"
            placeholder="Describe the free food..."
          />
          <input
            type="submit"
            value="Send"
            className="ms-2 btn btn-primary"
          />
        </form>
        <div style={{ height: '100vh', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyCSxzMYTqfbSHfVOtitKKztGTPQq-KfwwI" }}
            defaultCenter={{
              lat: 39.9534148,
              lng: -75.1892429
            }}
            defaultZoom={11}
          >
          </GoogleMapReact>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/feta-logo-better.png" alt="Convex Logo" width={90} height={18} />
          </span>
        </a>
      </footer>
    </div>
  )
}

  export default Home;
