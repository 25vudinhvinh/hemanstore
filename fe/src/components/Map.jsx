import { useContext, useEffect, useRef } from 'react'
import {
    MapContainer,
    TileLayer,
    Marker,
    ZoomControl,
    Tooltip,
} from 'react-leaflet'
import { GlobalContext } from '../context/GlobalContext'
import L from 'leaflet'
import defaultMarker from '~/assets/eat.svg'
import selectedMarker from '~/assets/red_marker.svg'

function Map() {
    const { locationSearch, selectedLocation, setSelectedLocation } =
        useContext(GlobalContext)
    const mapRef = useRef(null)

    // Icon mặc định
    const defaultIcon = L.icon({
        iconUrl: defaultMarker,
        iconAnchor: [12.5, 25],
        iconSize: [25, 25],
    })

    // Marker đỏ cho địa điểm được chọn
    const selectedIcon = L.icon({
        iconUrl: selectedMarker,
        iconAnchor: [12.5, 25],
        iconSize: [45, 45],
    })

    // Cập nhật trung tâm và zoom khi selectedLocation thay đổi
    useEffect(() => {
        if (
            selectedLocation &&
            selectedLocation.latitude &&
            selectedLocation.longitude &&
            mapRef.current
        ) {
            const map = mapRef.current
            const offsetLongitude = selectedLocation.longitude - 0.008
            map.setView([selectedLocation.latitude, offsetLongitude], 16)
        }
    }, [selectedLocation])

    return (
        <div tabIndex="-1" className="w-full h-full ">
            <MapContainer
                className="w-full h-full"
                center={[21.0285, 105.8542]}
                zoom={15}
                scrollWheelZoom={true}
                zoomControl={false}
                ref={mapRef}
            >
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {locationSearch.map((item, key) => {
                    return (
                        <Marker
                            key={key}
                            position={[item.latitude, item.longitude]}
                            icon={
                                selectedLocation &&
                                selectedLocation.location_id ===
                                    item.location_id
                                    ? selectedIcon
                                    : defaultIcon
                            }
                            eventHandlers={{
                                click: () => {
                                    setSelectedLocation(item)
                                },
                            }}
                        >
                            <Tooltip className="font-semibold opacity-80">
                                {item.name}
                            </Tooltip>
                        </Marker>
                    )
                })}
                <ZoomControl position="bottomright" />
            </MapContainer>
        </div>
    )
}

export default Map
