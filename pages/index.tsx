import Head from 'next/head'
import Image from 'next/image'
import { useQuery } from '../convex/_generated/react'

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
  const listFoodItems = useQuery("listFoodItems") || [];

  return (
    <div>
      <Head>
        <title>Feta</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        
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

      <footer>
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
