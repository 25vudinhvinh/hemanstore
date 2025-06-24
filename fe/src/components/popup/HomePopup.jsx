import { useContext, useEffect } from 'react'
import search from '~/assets/search.svg'
import { GlobalContext } from '../../context/GlobalContext'
import axios from 'axios'
import SearchResult from '../popupSearch/SearchResult'

function HomePopup() {
    const { inputValue, setInputValue, setLocationSearch, locationSearch } =
        useContext(GlobalContext)

    const handleChangeInput = (e) => {
        setInputValue(e.target.value)
    }

    useEffect(() => {
        if (inputValue.trim()) {
            axios
                .post('http://localhost:5000/api/locations', {
                    categoryName: inputValue,
                })
                .then((res) => setLocationSearch(res.data))
                .catch((error) => console.error('Error:', error))
        } else {
            setLocationSearch([])
        }
    }, [inputValue])

    return (
        <div className="relative w-full">
            <div className="flex items-center relative bg-white shadow-md rounded-2xl px-3 mt-3 ml-2 z-10 border-gray-100 border-2">
                <div className="flex-1 ">
                    <input
                        className="w-full bg-white p-2 rounded-2xl select-none outline-none font-semibold text-sm opacity-80 placeholder:text-[12px] placeholder:text-gray-500"
                        placeholder="Tìm kiếm trên Maps"
                        type="text"
                        value={inputValue}
                        onChange={handleChangeInput}
                    />
                </div>
                <div className="w-[20px] h-[20px]  opacity-65">
                    <img src={search} alt="Search icon" />
                </div>
            </div>
            {locationSearch?.length > 0 && (
                <div className="fixed top-0 left-[65px] w-[28%] bottom-0 bg-white rounded-2xl shadow-md z-0">
                    <SearchResult />
                </div>
            )}
        </div>
    )
}

export default HomePopup
