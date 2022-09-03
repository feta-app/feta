import Head from 'next/head'
import Image from 'next/image'
import { useQuery } from '../convex/_generated/react'
import styles from '../styles/Home.module.css';
import GoogleMapReact from 'google-map-react';
import { filter, useColorModeValue } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
import { useLocationState } from '../lib/location';
import distance from '@turf/distance';

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

  const [locationState, fetchLocation] = useLocationState();
  const sortedResults = useMemo(() => {
    if (locationState.type === "loaded") {
      const coords = [locationState.position.coords.longitude, locationState.position.coords.latitude];
      return [...results].sort(({ item: { lat: aLat, long: aLong } }, { item: { lat: bLat, long: bLong } }) => {
        const aDist = distance(coords, [aLong, aLat]);
        const bDist = distance(coords, [bLong, bLat]);
        return aDist - bDist;
      });
    } else {
      return results;
    }
  }, [locationState, results]);

  return (
    <div>
      <Head>
        <title>Feta</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Input type="search" placeholder="Search for a food..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

        <Flex width="100%" height={["auto", "auto", "100vh"]} direction={["column", "column", "row"]}>
          <Box h={[320, 320, "full"]} flexGrow={[0, 0, 1]}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: "AIzaSyCSxzMYTqfbSHfVOtitKKztGTPQq-KfwwI" }}
              defaultCenter={{
                lat: 39.9534148,
                lng: -75.1892429
              }}
              defaultZoom={14}
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
              {locationState.type === "loaded" && <Box transform="translate(-50%, -50%)"
                /* @ts-ignore */
                lat={locationState.position.coords.latitude} lng={locationState.position.coords.longitude}
                backgroundColor="blue.500"
                border="3px solid white"
                w={6}
                h={6}
                borderRadius="50%"
              />}
            </GoogleMapReact>
          </Box>
          <Box w={["full", "full", 540]} h={["auto", "auto", "full"]}>
            {locationState.type !== "loaded" && <Flex p={4} alignItems="center" direction="column" justifyContent="center" borderBottom="1px" borderBottomColor="gray.200" gap={2}>
              <Heading fontSize={18}>Use your location to find food near you</Heading>
              {locationState.type === "error" && <Box color="red">Couldn't determine location.</Box>}
              <Button colorScheme="orange" onClick={fetchLocation} isLoading={locationState.type === "loading"}>Get me food</Button>
            </Flex>}
            {sortedResults.map(({ item: foodItem }) => {
              return <Flex key={foodItem._id} p={4} alignItems="center" borderBottom="1px" borderBottomColor="gray.200" gap={3}>
                <img src={foodItem.photo} style={{ width: 50, height: 50, alignItems: 'center', borderRadius: '50%', objectFit: "cover" }} />
                <Text flexGrow={1}>{foodItem.description}</Text>
              </Flex>;
            })}
          </Box>
        </Flex>
      </main>
    </div>
  )
}

  export default Home;
