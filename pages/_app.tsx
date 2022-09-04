import '../styles/globals.css'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import clientConfig from "../convex/_generated/clientConfig";
import { Button, ChakraProvider } from '@chakra-ui/react';
import { ConvexProviderWithAuth0 } from 'convex/react-auth0';
import Navbar from '../components/navbar';
import convexConfig from '../convex.json';
import { createContext, Fragment, PropsWithChildren, useContext, useEffect, useState } from 'react';
import storeUser from '../convex/storeUser';
import { useMutation } from '../convex/_generated/react';
import { LocationProvider, useLocationState } from '../components/location';
import { useAuth0 } from '@auth0/auth0-react';

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

function SuperHackyLoginPage() {
  const { loginWithRedirect } = useAuth0();
  
  return <div className="super-hacky-page" style={{
    height: "100vh",
  }}>
    <iframe src="https://get-feta.glitch.me" style={{
      width: "100%",
      height: "calc(100vh - 100px)",
      border: "none",
      margin: "0",
    }} />
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Button size="lg" backgroundColor="black" colorScheme="blackAlpha" onClick={() => {
        loginWithRedirect();
      }}>Log in</Button>
    </div>
  </div>
}

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ConvexProviderWithAuth0
        client={convex}
        authInfo={authInfo}
        loggedOut={<SuperHackyLoginPage />}
      >
        <UserStorer>
          <LocationProvider>
            <Navbar />
            <Component {...pageProps} />
          </LocationProvider>
        </UserStorer>
      </ConvexProviderWithAuth0>
    </ChakraProvider>
  )
}

export default MyApp
