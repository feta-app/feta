import Head from 'next/head'
import Image from 'next/image'
import { useQuery } from '../convex/_generated/react'
import styles from '../styles/Home.module.css';
import GoogleMapReact from 'google-map-react';
import { filter, useColorModeValue } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { Box, Flex, Input } from '@chakra-ui/react';

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

const styleLight = {
  
}
const styleDark = {
  height: "100vh",
  filter: "invert(90%)"
}
const Home = () => {
  const foodItems = useQuery("listFoodItems") || [];
  const searcher = useMemo(() => {
    return new Fuse(foodItems, {
      keys: ["description"],
    });
  }, [foodItems]);
  const [searchTerm, setSearchTerm] = useState("");
  const results = useMemo(() => {
    if (searchTerm.trim()) {
      return searcher.search(searchTerm);
    } else {
      return foodItems.map(item => ({ item }));
    }
  }, [searcher, searchTerm]);

  return (
    <div>
      <Head>
        <title>Feta</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Input type="search" placeholder="Search for a food..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

        <Flex width="100%" height={["auto", "100vh"]} direction={["column", "row"]}>
          <Box h={[320, "full"]} flexGrow={[0, 1]}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: "AIzaSyCSxzMYTqfbSHfVOtitKKztGTPQq-KfwwI" }}
              defaultCenter={{
                lat: 39.9534148,
                lng: -75.1892429
              }}
              defaultZoom={11}
            >
              {results.map(({ item: foodItem }) => {
                // For each food item, return an annotation.
                return <div
                  key={foodItem._id}
                  /* @ts-ignore */
                  lat={foodItem.lat}
                  /* @ts-ignore */
                  lng={foodItem.long}
                  style={{
                    color: 'white',
                    background: '#EB8258',
                    padding: '3px 3px',
                    display: 'inline-flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    overflow: 'hidden',
                  }}>
                    <img src={foodItem.photo} style={{ width: 60, height: 60, alignItems: 'center', borderRadius: '50%', objectFit: "cover" }} />
                </div>
              })}
            </GoogleMapReact>
          </Box>
          <Box w={["full", 540]} h={["auto", "full"]}>
            sdfasdf
          </Box>
        </Flex>
      </main>
    </div>
  )
}

  export default Home;
