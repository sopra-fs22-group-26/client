/* global google */
import 'styles/ui/Map.scss';
import {React, useEffect, useState} from "react";
import { GoogleMap, LoadScript, useLoadScript, Autocomplete, Marker} from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

const MapMarked = (location) => {
    console.log(location);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyDr53V_g_IctWuuNYyq10yiAqyJXWsIOU4",
        libraries: ["places"],
    });

    if(!isLoaded) return <div>Loading...</div>;
    return (
       <MapCombined location={location}/>
    );
}

function MapCombined(location){
    const locationArray = String(location["location"]["location"]).split(",");
    const latS = locationArray[0];
    const lngS = locationArray[1];
    return (
        <>
            <GoogleMap
                zoom={8}
                center={{lat: Number(latS), lng: Number(lngS)}}
                mapContainerClassName="map-container">
                {{lat: Number(latS), lng: Number(lngS)} && <Marker position={{lat: Number(latS), lng: Number(lngS)}} /> }
            </GoogleMap>
        </>
    );
}

export default MapMarked;



