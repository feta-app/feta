import { useState } from "react";

export type LocationState = { type: "none" | "loading" | "error" } | { type: "loaded", position?: GeolocationPosition };

export function useLocationState(): [LocationState, () => void] {
    const [locationState, setLocationState] = useState<LocationState>({ type: "none" });

    return [
        locationState,
        () => {
            setLocationState({ type: "loading" });
            navigator.geolocation.getCurrentPosition(position => {
                setLocationState({ type: "loaded", position });
            }, error => {
                console.error(error);
                setLocationState({ type: "error" });
            });
        },
    ];
}