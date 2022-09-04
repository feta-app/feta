import Head from 'next/head'
import { useQuery } from '../convex/_generated/react'
import GoogleMapReact from 'google-map-react';
import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
import { unitify, useLocationState } from '../components/location';
import distance from '@turf/distance';
import ms from 'ms';

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
      keys: [
        {
          name: "description",
          weight: 3,
        }, {
          name: "keywords.name",
          weight: 1,
        }],
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

  useEffect(() => {
    if (locationState.type === "loaded") {
      setCenter({
        lat: locationState.position.coords.latitude,
        lng: locationState.position.coords.longitude,
      });
      setZoom(15);
    }
  }, [locationState.type]);
  
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, ms("1s"));
    return () => clearInterval(interval);
  }, []);

  const [selectedID, setSelectedID] = useState<string | null>(null);
  const selectedItem = foodItems.find(item => item._id === selectedID);
  const [center, setCenter] = useState({
    lat: 39.9534148,
    lng: -75.1892429,
  });
  const [zoom, setZoom] = useState(14);

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
              center={center}
              zoom={zoom}
            >
              {results.filter(({ item }) => item._id !== selectedID).map(({ item: foodItem }) => {
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
                    padding: '2px 2px',
                    display: 'inline-flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    overflow: 'hidden',
                  }}>
                    {foodItem.photo ? <img src={foodItem.photo} style={{ width: 30, height: 30, alignItems: 'center', borderRadius: '50%', objectFit: "cover", cursor: "pointer" }} onClick={
                      () => setSelectedID(foodItem._id)
                    } /> : <div style={{width: 30, height: 30, cursor: "pointer"}} onClick={
                      () => setSelectedID(foodItem._id)
                    } />}
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
              {selectedItem && <div
                /* @ts-ignore */
                lat={selectedItem.lat} lng={selectedItem.long}
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
                  overflow: 'visible',
                  position: 'relative',
                }}
              >
                {selectedItem.photo ? <img src={selectedItem.photo} style={{ width: 90, height: 90, alignItems: 'center', borderRadius: '50%', objectFit: "cover", cursor: "pointer" }} onClick={
                  () => setSelectedID(null)
                } /> : <div style={{ width: 90, height: 90, cursor: "pointer" }} onClick={
                  () => setSelectedID(null)
                } />}
                <Box fontSize="md" textAlign="left" position="absolute" backgroundColor="whiteAlpha.900" backdropFilter="saturate(0)" color="black" width={300} p={4} borderRadius={10} bottom={100} shadow="base">
                  <Text fontSize="lg" fontWeight="bold">{selectedItem.description}</Text>
                  {locationState.type === "loaded" && <Text color="gray.800" mb={2}>{unitify(distance([locationState.position!.coords.longitude, locationState.position!.coords.latitude], [selectedItem.long, selectedItem.lat], {
                    units: "miles",
                  }))} away</Text>}
                  <Text color="gray.500">Expires in {ms(selectedItem.expiresAt * 1000 - now, { long: true })}</Text>
                  <Text color="gray.500">Posted by {selectedItem.userName}</Text>
                </Box>
              </div>}
            </GoogleMapReact>
          </Box>
          <Box w={["full", "full", 540]} h={["auto", "auto", "full"]} overflow={["visible", "auto"]}>
            {locationState.type !== "loaded" && <Flex p={4} alignItems="center" direction="column" justifyContent="center" borderBottom="1px" borderBottomColor="gray.200" gap={2}>
              <Heading fontSize={18}>Use your location to find food near you</Heading>
              {locationState.type === "error" && <Box color="red">Couldn't determine location.</Box>}
              <Button colorScheme="orange" onClick={fetchLocation} isLoading={locationState.type === "loading"}>Get me food</Button>
            </Flex>}
            {sortedResults.map(({ item: foodItem }) => {
              return <a href="#" onClick={e => {
                e.preventDefault();
                if (selectedID === foodItem._id) {
                  setSelectedID(null);
                  setCenter(null);
                  setZoom(null);
                } else {
                  setSelectedID(foodItem._id);
                  setCenter({
                    lat: foodItem.lat,
                    lng: foodItem.long,
                  });
                  setZoom(17);
                }
              }}>
                <Flex key={foodItem._id} p={4} alignItems="center" borderBottom="1px" borderBottomColor={"gray.200"} backgroundColor={foodItem._id === selectedID ? "blue.100" : "white"} gap={3}>
                  <img src={foodItem.photo} style={{ width: 50, height: 50, alignItems: 'center', borderRadius: '50%', objectFit: "cover" }} />
                  <Box flexGrow={1}>
                    <Text fontWeight="bold">{foodItem.description}</Text>
                    <Text color="gray.500">Expires in {ms(foodItem.expiresAt * 1000 - now, { long: true })}</Text>
                  </Box>
                  {locationState.type === "loaded" && <Text textAlign="right" fontSize="lg">{unitify(distance([locationState.position!.coords.longitude, locationState.position!.coords.latitude], [foodItem.long, foodItem.lat], {
                    units: "miles",
                  }))}</Text>}
                </Flex>
              </a>;
            })}
          </Box>
        </Flex>
      </main>
    </div>
  )
}

  export default Home;
