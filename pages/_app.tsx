import '../styles/globals.css'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import clientConfig from "../convex/_generated/clientConfig";
import { ChakraProvider } from '@chakra-ui/react';
const convex = new ConvexReactClient(clientConfig);

function MyApp({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain="dev--zhus8r0.us.auth0.com"
      clientId="0OLYMc0NC9InvP4WCKGweiIyEtOeNCjj"
      redirectUri={window.location.origin}
    >
      <ChakraProvider>
        <ConvexProvider client={convex}>
          <Component {...pageProps} />
        </ConvexProvider>
      </ChakraProvider>
    </Auth0Provider>
  )
}

export default MyApp
