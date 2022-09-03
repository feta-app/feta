import '../styles/globals.css'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import clientConfig from "../convex/_generated/clientConfig";
import { ChakraProvider } from '@chakra-ui/react';
import { ConvexProviderWithAuth0 } from 'convex/react-auth0';
import Navbar from '../components/navbar';
import convexConfig from '../convex.json';
import { createContext, Fragment, PropsWithChildren, useContext, useEffect, useState } from 'react';
import storeUser from '../convex/storeUser';
import { useMutation } from '../convex/_generated/react';
import { LocationProvider, useLocationState } from '../components/location';

const convex = new ConvexReactClient(clientConfig);
const authInfo = convexConfig.authInfo[0];

const UserIDContext = createContext("");

function UserStorer({ children }: PropsWithChildren<{}>) {
  const storeUser = useMutation("storeUser");
  const [id, setID] = useState("");

  useEffect(() => {
    (async () => {
      const id = await storeUser();
      setID(id);
    })();
  }, [storeUser]);

  return <UserIDContext.Provider value={id}>
    {children}
  </UserIDContext.Provider>;
}

export function useUserID() {
  return useContext(UserIDContext);
}

function MyApp({ Component, pageProps }) {
  return (
    <ConvexProviderWithAuth0
      client={convex}
      authInfo={authInfo}
    >
      <UserStorer>
        <LocationProvider>
          <ChakraProvider>
            <Navbar />
            <Component {...pageProps} />
          </ChakraProvider>
        </LocationProvider>
      </UserStorer>
    </ConvexProviderWithAuth0>
  )
}

export default MyApp
