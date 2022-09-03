import { createContext, PropsWithChildren, useContext, useState } from "react";

export type LocationState = { type: "none" | "loading" | "error" } | { type: "loaded", position?: GeolocationPosition };

const LocationContext = createContext<[ LocationState, () => void ]>([{
    type: "none",
}, () => {}]);

export function LocationProvider({ children }: PropsWithChildren<{}>) {
    const [locationState, setLocationState] = useState<LocationState>({ type: "none" });

    const context: [LocationState, () => void] = [
        locationState,
        () => {
            setLocationState({ type: "loading" });
            navigator.geolocation.watchPosition(position => {
                setLocationState({ type: "loaded", position });
            }, error => {
                console.error(error);
                setLocationState({ type: "error" });
            });
        },
    ];

    return <LocationContext.Provider value={context}>{children}</LocationContext.Provider>;
}

export function useLocationState(): [LocationState, () => void] {
    return useContext(LocationContext);
}

export function unitify(miles: number) {
    // If miles is less than 0.2, return feet.
    if (miles <= 0.2) {
        return `${Math.round(miles * 5280)} ft`;
    }

    return `${miles.toFixed(1)} mi`;
}