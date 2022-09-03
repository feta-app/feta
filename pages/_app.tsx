import '../styles/globals.css'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import clientConfig from "../convex/_generated/clientConfig";
import { ChakraProvider } from '@chakra-ui/react';
import { ConvexProviderWithAuth0 } from 'convex/react-auth0';
import Navbar from '../components/navbar';
import convexConfig from '../convex.json';
import { Fragment, useEffect } from 'react';
import storeUser from '../convex/storeUser';
import { useMutation } from '../convex/_generated/react';

const convex = new ConvexReactClient(clientConfig);
const authInfo = convexConfig.authInfo[0];

function UserStorer() {
  const storeUser = useMutation("storeUser");

  useEffect(() => {
    storeUser();
  }, [storeUser]);

  return <Fragment />;
}

function MyApp({ Component, pageProps }) {
  return (
    <ConvexProviderWithAuth0
      client={convex}
      authInfo={authInfo}
    >
      <ChakraProvider>
        <Navbar />
        <Component {...pageProps} />
      </ChakraProvider>
      <UserStorer />
    </ConvexProviderWithAuth0>
  )
}

export default MyApp
