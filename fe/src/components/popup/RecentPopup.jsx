import { useEffect, useState, useContext, memo } from 'react'
import closeIcon from '~/assets/close.svg'
import importainIcon from '~/assets/importain.svg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Location from '../popupSearch/Location'
import { GlobalContext } from '../../context/GlobalContext'
import InforLocation from '../popupSearch/InforLocation'

const RecentPopup = () => {
    const navigate = useNavigate()
    const {
        setSelectedLocation,
        setLocationSearch,
        selectedLocation,
        setPopupInfor,
        popupInfor,
        setShowButtonGroup,
    } = useContext(GlobalContext)
    const [userLocation, setUserLocation] = useState({
        latitude: null,
        longitude: null,
    })
    const [selectValue, setSelectValue] = useState(2)
    const [locations, setLocations] = useState([])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            })
        })
    }, [])

    useEffect(() => {
        // Chỉ cập nhật popupInfor nếu selectedLocation là object
        if (
            selectedLocation &&
            !Array.isArray(selectedLocation) &&
            typeof selectedLocation === 'object'
        ) {
            setPopupInfor(true)
        } else {
            setPopupInfor(false)
        }
    }, [selectedLocation, setPopupInfor])

    const handleSelect = (e) => {
        setSelectValue(e.target.value)
    }

    useEffect(() => {
        if (userLocation.latitude && userLocation.longitude) {
            axios
                .post('http://localhost:5000/api/locations/nearby', {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    radius: selectValue,
                })
                .then((res) => {
                    setLocations(res.data)
                    setLocationSearch(res.data)
                })
                .catch((error) =>
                    console.error('Error fetching locations:', error)
                )
        }
    }, [
        selectValue,
        userLocation.latitude,
        userLocation.longitude,
        setLocationSearch,
    ])

    return (
        <div className="w-full h-[730px] py-3 shadow-md bg-white ">
            <div className="flex items-center justify-between p-2 border-b-2 border-gray-200">
                <span className="flex gap-2 items-center select-none">
                    <p className="font-semibold text-2xl">Gần đây</p>
                    <select
                        name="km"
                        id="km"
                        className="px-2 py-1 bg-gray-100 rounded outline-0 border-0 text-green-700 font-semibold text-sm cursor-pointer"
                        onChange={handleSelect}
                    >
                        <option value="2">2Km</option>
                        <option value="5">5Km</option>
                        <option value="10">10Km</option>
                    </select>
                    <img
                        className="w-[20px] h-[20px]"
                        src={importainIcon}
                        alt=""
                    />
                </span>
                <img
                    className="cursor-pointer w-8"
                    onClick={() => {
                        navigate('/home')
                        setShowButtonGroup(true)
                    }}
                    src={closeIcon}
                    alt=""
                />
            </div>
            <div className="mx-2 overflow-scroll scrollbar-hidden h-[93%] rounded">
                {locations.map((item, index) => (
                    <div key={index}>
                        <Location
                            item={item}
                            distance={item.distance}
                            onClick={() => setSelectedLocation(item)}
                        />
                    </div>
                ))}
            </div>
            {popupInfor && (
                <InforLocation selectedLocation={selectedLocation} />
            )}
        </div>
    )
}

// Bọc component trong React.memo để tối ưu hóa
export default memo(RecentPopup)
