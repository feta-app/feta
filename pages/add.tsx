import { Box, Button, Flex, Image, Input, Select, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useLocationState } from "../components/location";
import { useMutation } from "../convex/_generated/react";

export default function AddFood() {
    const webcamRef = useRef();
    const [image, setImage] = useState(null);
    const capture = useCallback(() => {
        // @ts-ignore
        setImage(webcamRef.current.getScreenshot());
    }, [webcamRef]);

    const [locationState, fetchLocation] = useLocationState();

    const [description, setDescription] = useState("");
    const [expiresIn, setExpiresIn] = useState((60 * 60).toString());

    const [isSubmitting, setSubmitting] = useState(false);
    const { push } = useRouter();

    const createFoodItem = useMutation("createFoodItem");

    return <Box>
        <Box p={4} textAlign="center">
            Add Food
        </Box>
        <Box px={[4, 0]} maxWidth={800} mx="auto">
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
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the food..." width="100%" size="md" />
            </Box>
            <Box mb={2}>
                <Select value={expiresIn} onChange={e => setExpiresIn(e.target.value)}>
                    <option value={(15 * 60).toString()}>Expires in 15 minutes</option>
                    <option value={(60 * 60).toString()}>Expires in 1 hour</option>
                    <option value={(6 * 60 * 60).toString()}>Expires in 6 hours</option>
                    <option value={(12 * 60 * 60).toString()}>Expires in 12 hours</option>
                    <option value={(24 * 60 * 60).toString()}>Expires in 1 day</option>
                    <option value={(3 * 24 * 60 * 60).toString()}>Expires in 3 days</option>
                    <option value={(7 * 24 * 60 * 60).toString()}>Expires in 1 week</option>
                    <option value={(30 * 24 * 60 * 60).toString()}>Expires in 1 month</option>
                </Select>
            </Box>
            <Flex mb={4} alignItems="center" gap={2}>
                <strong>Location</strong>
                {locationState.type === "error" && <Text color="red">Couldn't determine position</Text>}
                {locationState.type !== "loaded" && <Button isLoading={locationState.type === "loading"} gap={2} colorScheme="orange" onClick={fetchLocation}>Get location</Button>}
                {locationState.type === "loaded" && <span>({locationState.position.coords.latitude}, {locationState.position.coords.longitude})</span>}
            </Flex>
            <Box mb={4}>
                <Button onClick={async () => {
                    setSubmitting(true);
                    try {
                        if (locationState.type !== "loaded") throw new Error("Couldn't determine location");
                        await createFoodItem(description, locationState.position.coords.latitude, locationState.position.coords.longitude, parseInt(expiresIn), image);
                        push("/");
                    } catch (e) {
                        console.error(e);
                    } finally {
                        setSubmitting(false);
                    }
                }} colorScheme="orange" width="100%">Add food</Button>
            </Box>
        </Box>
    </Box>;
}