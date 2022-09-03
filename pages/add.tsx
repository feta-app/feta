import { Box, Button, Flex, Image, Input, Select, Text } from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

export default function AddFood() {
    const webcamRef = useRef();
    const [image, setImage] = useState(null);
    const capture = useCallback(() => {
        // @ts-ignore
        setImage(webcamRef.current.getScreenshot());
    }, [webcamRef]);
    const [locationState, setLocationState] = useState<{ type: string, position?: GeolocationPosition }>({
        // none, loading, error, loaded
        type: "none",
    });

    return <Box>
        <Box p={4} textAlign="center">
            Add Food
        </Box>
        <Box maxWidth={800} mx="auto">
            <Box mb={4} backgroundColor="black" backgroundImage={image} backgroundSize="contain" backgroundRepeat="no-repeat" backgroundPosition="center" width="100%" height={450} mx="auto" overflow="hidden" borderRadius={20} position="relative">
                {!image && <><Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "environment",
                }} style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    height: "100%",
                }} />
                    <Button position="absolute" left="50%" transform="translateX(-50%)" bottom={6} colorScheme="orange" onClick={() => capture()}>Capture</Button></>}
                {image && <>
                    <Button position="absolute" left="50%" transform="translateX(-50%)" bottom={6} onClick={() => setImage(null)}>Retake</Button>
                </>}
            </Box>
            <Box mb={2}>
                <Input placeholder="Describe the food..." width="100%" size="md" />
            </Box>
            <Box mb={2}>
                <Select>
                    <option value={15 * 60}>Expires in 15 minutes</option>
                    <option value={60 * 60}>Expires in 1 hour</option>
                    <option value={6 * 60 * 60}>Expires in 6 hours</option>
                    <option value={12 * 60 * 60}>Expires in 12 hours</option>
                    <option value={24 * 60 * 60}>Expires in 1 day</option>
                    <option value={3 * 24 * 60 * 60}>Expires in 3 days</option>
                    <option value={7 * 24 * 60 * 60}>Expires in 1 week</option>
                    <option value={30 * 24 * 60 * 60}>Expires in 1 month</option>
                </Select>
            </Box>
            <Flex mb={4} alignItems="center" gap={2}>
                <strong>Location</strong>
                {locationState.type === "error" && <Text color="red">Couldn't determine position</Text>}
                {locationState.type !== "loaded" && <Button isLoading={locationState.type === "loading"} gap={2} colorScheme="orange" onClick={async () => {
                    setLocationState({ type: "loading" });
                    navigator.geolocation.getCurrentPosition(position => {
                        setLocationState({ type: "loaded", position });
                    }, error => {
                        console.error(error);
                        setLocationState({ type: "error" });
                    });
                }}>Get location</Button>}
                {locationState.type === "loaded" && <span>({locationState.position.coords.latitude}, {locationState.position.coords.longitude})</span>}
            </Flex>
            <Box mb={4}>
                <Button colorScheme="orange" width="100%">Add food</Button>
            </Box>
        </Box>
    </Box>;
}