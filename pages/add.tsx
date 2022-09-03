import { Box } from "@chakra-ui/react";
import Webcam from "react-webcam";

export default function AddFood() {
    return <Box>
        <Box p={4} textAlign="center">
            Add Food
        </Box>
        <Box overflow="hidden" borderRadius={20} mx="auto" width="fit">
            <Webcam audio={false} screenshotFormat="image/jpeg" videoConstraints={{
                facingMode: "environment",
            }} />
        </Box>
    </Box>;
}