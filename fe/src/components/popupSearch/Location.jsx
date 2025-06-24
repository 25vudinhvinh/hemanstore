import { useContext, useState } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import Rating from '@mui/material/Rating'

function Location({ item, onClick, distance }) {
    const { setPopupInfor, setSelectedLocation } = useContext(GlobalContext)

    return (
        <div
            onClick={() => {
                onClick()
                setSelectedLocation(item)
                setPopupInfor(true)
            }}
            className="border-gray-200 border-b-2 select-none my-0.5 hover:bg-gray-200 rounded"
        >
            <div className="flex min-h-30 justify-between items-center cursor-pointer">
                <div className="w-[60%]">
                    <p className="font-semibold text-lg">{item.name}</p>
                    <p className="text-sm font-semibold opacity-60">
                        {item.address}
                    </p>
                    <span className="flex items-center gap-1 text-md font-semibold">
                        <p className="opacity-60">{item.average_rating}</p>
                        <Rating
                            name="simple-controlled"
                            value={item.average_rating}
                            readOnly
                            sx={{ '& .MuiRating-icon': { fontSize: '0.8rem' } }}
                        />
                        <p className="opacity-60">({item.review_count})</p>
                    </span>
                    <p className="text-green-700 text-sm font-semibold opacity-60">
                        Giờ mở cửa: {item.open_hours}
                    </p>
                    {distance && (
                        <span className="text-sm text-red-600 font-semibold">
                            {distance} Km
                        </span>
                    )}
                </div>
                <div>
                    <img
                        className="object-cover w-[100px] h-[100px] rounded-2xl"
                        src={item.primary_image}
                        alt=""
                    />
                </div>
            </div>
            <div className="mt-2">
                <p className="opacity-60 text-sm font-semibold">
                    {item.additional_services.split(', ').join(' - ')}
                </p>
            </div>
        </div>
    )
}

export default Location
