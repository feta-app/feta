import '../styles/globals.css'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import clientConfig from "../convex/_generated/clientConfig";
import { ChakraProvider } from '@chakra-ui/react';
const convex = new ConvexReactClient(clientConfig);

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ConvexProvider client={convex}>
        <Component {...pageProps} />
      </ConvexProvider>
    </ChakraProvider>
  )
}

export default MyApp
