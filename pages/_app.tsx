import '../styles/globals.css'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import clientConfig from "../convex/_generated/clientConfig";
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from '../components/navbar';
// const convex = new ConvexReactClient(clientConfig);

const convex = new ConvexReactClient(clientConfig);
const authInfo = convexConfig.authInfo[0];

function MyApp({ Component, pageProps }) {
  return (
    <ConvexProviderWithAuth0
      client={convex}
      authInfo={authInfo}
      loggedOut={<Login />}
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
