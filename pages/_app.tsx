import '../styles/globals.css'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import clientConfig from "../convex/_generated/clientConfig";
import { ChakraProvider } from '@chakra-ui/react';
import { ConvexProviderWithAuth0 } from 'convex/react-auth0';
import Navbar from '../components/navbar';
import convexConfig from '../convex.json';

const convex = new ConvexReactClient(clientConfig);
const authInfo = convexConfig.authInfo[0];

function MyApp({ Component, pageProps }) {
  return (
    <ConvexProviderWithAuth0
      client={convex}
      authInfo={authInfo}
    >
    <ChakraProvider>
      <ConvexProvider client={convex}>
        <Navbar />
        <Component {...pageProps} />
      </ConvexProvider>
    </ChakraProvider>
    </ConvexProviderWithAuth0>
  )
}

export default MyApp
