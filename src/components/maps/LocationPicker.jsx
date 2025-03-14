import React, { useEffect, useRef } from 'react';
import Radar from 'radar-sdk-js';
import 'radar-sdk-js/dist/radar.css';

const LocationPicker = ({onLocationSelect}) => {
    const radarInitialized = useRef(false);
    const mapRef = useRef(null);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        // @ts-ignore
        Radar.initialize(import.meta.env.VITE_RADAR_PUBLISHABLE_KEY);

        // Create a map
        const map = Radar.ui.map({
            container: 'map',
            style: 'radar-default-v1',
            center: [106.6297, 10.8231],
            zoom: 14,
        });
        mapRef.current = map;

        // Suppress missing image warning
        map.on('styleimagemissing', () => {
            return;
        });

        map.on('click', (e) => {
            const { lng, lat } = e.lngLat;
            // Reverse geocode the clicked location
            Radar.reverseGeocode({
                latitude: lat,
                longitude: lng
            }).then((result) => {
                if (result.addresses && result.addresses.length > 0) {
                    const address = result.addresses[0];
                    onLocationSelect({
                        latitude: lat,
                        longitude: lng,
                        formattedAddress: address.formattedAddress,
                        city: address.city,
                        state: address.state,
                        country: address.country
                    });
                }
            });
        });

        // Initialize Radar autocomplete
        autocompleteRef.current = Radar.ui.autocomplete({
            container: 'autocomplete',
            placeholder: 'Search for a location',
            onSelection: (address) => {
                const { latitude, longitude } = address;
                onLocationSelect({
                    latitude: latitude,
                    longitude: longitude,
                    formattedAddress: address.formattedAddress,
                    city: address.city,
                    state: address.state,
                    country: address.country
                });

                // Center the map on the selected address
                mapRef.current.flyTo({ center: [longitude, latitude], zoom: 14 });
            },
        });
        return () => {
            autocompleteRef.current?.remove();
            mapRef.current?.remove();
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <div id="autocomplete" style={{ position: 'absolute', width: '70%', top: 60, left: 40, zIndex:3 }} />
            <div id="map" style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default LocationPicker;