import 'styles/ui/Map.scss';
import {React, useEffect, useState} from "react"

import { GoogleMap, LoadScript, useLoadScript, Autocomplete, Marker} from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {ComboboxList,
        ComboboxInput,
        ComboboxPopover,
    Combobox,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css"




const Map = () => {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyDr53V_g_IctWuuNYyq10yiAqyJXWsIOU4",
        libraries: ["places"],
    });



    if(!isLoaded) return <div>Loading...</div>;
    return (
       <Mapp />
    );

}
function Mapp(){

    const [selected, setSelected] = useState(null);

    return (
        <>
            <div className="places-container">
                <PlacesAutocomplete setSelected={setSelected} />
            </div>

            <GoogleMap
                zoom={8}
                center={{lat: 44, lng:-80}}
                mapContainerClassName="map-container">
                {selected && <Marker position={selected} /> }
            </GoogleMap>
        </>
    );
}

const PlacesAutocomplete = ({setSelected}) => {
    const {
        ready,
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({address});
        const {lat, lng} = await getLatLng(results[0]);
        setSelected({ lat, lng });

    }
    return <Combobox onSelect={handleSelect}>
        <ComboboxInput value={value} onChange={e => setValue(e.target.value)} disabled={!ready}
        className="combobox-input" placeholer="search for an address.."/>
        <ComboboxPopover>
            <ComboboxList>
                {status === "OK" && data.map(({place_id, description}) => <ComboboxOption key={place_id} value={description}/>)}
            </ComboboxList>
        </ComboboxPopover>
    </Combobox>
}
export default Map;



