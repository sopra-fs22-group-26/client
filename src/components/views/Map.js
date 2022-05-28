/* global google */
import 'styles/ui/Map.scss';
import {React, useEffect, useState} from "react";
import { GoogleMap, LoadScript, useLoadScript, Autocomplete, Marker} from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import {AuthUtil} from "../../helpers/authUtil";
import {handleError} from "../../helpers/api";

const Map = ({locationStr,setLocation}) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyDr53V_g_IctWuuNYyq10yiAqyJXWsIOU4",
        libraries: ["places"],
    });

    if(!isLoaded) return <div>Loading...</div>;
    return (
       <MapCombined locationStr={locationStr} setLocation={setLocation}/>
    );
}

function MapCombined({locationStr, setLocation}){

    const [selected, setSelected] = useState(null);
    const [stoned, setStoned] = useState(null);

    useEffect( () => {
        async function fetchData() {
            try {
                console.log(locationStr);
                if(locationStr!==null & locationStr!==undefined){
                    // console.log(locationStr);
                    const locationArray = String(locationStr).split(",");
                    // console.log(locationArray);
                    const stoned = {lat: Number(locationArray[0]), lng: Number(locationArray[1])};
                    setStoned(stoned);
                    // console.log(stoned);
                }
            } catch (error) {
                if (error.response.status === 401) {
                    await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
                    setTimeout(fetchData, 200);
                } else {
                    console.error(`Something went wrong while fetching the data: \n${handleError(error)}`);
                    console.error("Details:", error);
                    alert("Something went wrong while fetching the data! See the console for details.");
                }
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <div className="places-container">
                <PlacesAutocomplete setSelected={setSelected} locationStr={locationStr} setLocation={setLocation} />
            </div>

            <GoogleMap
                zoom={8}
                center={ selected ? selected : (stoned ? stoned : {lat: 47.38, lng:8.54})}
                mapContainerClassName="map-container">
                {(selected ? selected : stoned) && <Marker position={selected ? selected : stoned} /> }
            </GoogleMap>
        </>
    );
}

const PlacesAutocomplete = ({setSelected,locationStr,setLocation}) => {
    const {
        ready,
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions,
    } = usePlacesAutocomplete();

    const ref = useOnclickOutside(() => {
        // When user clicks outside of the component, we can dismiss
        // the searched suggestions by calling this method
        clearSuggestions();
    });

    const handleInput = (e) => {
        // Update the keyword of the input element
        setValue(String(e.target.value));
    };

    const handleSelect =
        ({ description }) =>
            () => {
                // When user selects a place, we can replace the keyword without request data from API
                // by setting the second parameter to "false"
                setValue(description, false);
                clearSuggestions();

                // Get latitude and longitude via utility functions
                getGeocode({ address: description }).then((results) => {
                    try {
                        const { lat, lng } = getLatLng(results[0]);
                        console.log("📍 Coordinates: ", { lat, lng });
                        setSelected({ lat, lng});
                        setLocation(String(lat)+","+String(lng));
                    } catch (error) {
                        console.log("😱 Error: ", error);
                    }
                });
            };

    const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <li key={place_id} onClick={handleSelect(suggestion)}>
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });

    return (
        <div ref={ref}>
            <label className= 'creation-form label'>
                Location:
            </label>
            <input
                value={value}
                type="text"
                onChange={handleInput}
                disabled={!ready}
                placeholder={locationStr ? locationStr : "Where are you going?"}
            />

            {/* We can use the "status" to decide whether we should display the dropdown or not */}
            {status === "OK" && <ul>{renderSuggestions()}</ul>}
        </div>
    );

}
export default Map;



