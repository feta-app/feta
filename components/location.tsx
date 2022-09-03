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

export function unitify(meters: number) {
    // Convert to miles.
    const miles = meters * 0.000621371;

    // If miles is less than 0.5, return feet.
    if (miles < 0.5) {
        return `${Math.round(meters * 3.28084)} ft`;
    }

    return `${miles.toFixed(1)} mi`;
}