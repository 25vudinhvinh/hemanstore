import { useContext, useEffect, memo } from 'react'
import importainIcon from '~/assets/importain.svg'
import { GlobalContext } from '../../context/GlobalContext'
import Location from './Location'
import InforLocation from './InforLocation'

function SearchResult() {
    const {
        locationSearch,
        setSelectedLocation,
        selectedLocation,
        setPopupInfor,
        popupInfor,
    } = useContext(GlobalContext)

    const handleClick = (item) => {
        setSelectedLocation(item)
    }

    useEffect(() => {
        setPopupInfor(false)

        if (
            selectedLocation &&
            !Array.isArray(selectedLocation) &&
            typeof selectedLocation === 'object'
        ) {
            setPopupInfor(true)
        }
    }, [locationSearch, selectedLocation, setPopupInfor])

    return (
        <div className="w-full h-[84%] rounded-2xl bg-gray-50 z-10 px-2 select-none ">
            <div className="flex gap-1 items-center pt-[65px] mt-2 pb-2">
                <p className="text-lg mb-0 font-medium opacity-85">Kết quả</p>
                <img className="w-[20px]" src={importainIcon} alt="" />
            </div>
            <div className="h-full overflow-scroll scrollbar-hidden">
                {locationSearch.map((item, index) => (
                    <Location
                        onClick={() => handleClick(item)}
                        item={item}
                        key={index}
                    />
                ))}
            </div>
            {popupInfor && (
                <InforLocation selectedLocation={selectedLocation} />
            )}
        </div>
    )
}

export default memo(SearchResult)
