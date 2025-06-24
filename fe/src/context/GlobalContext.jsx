// contexr/GlobalContext.jsx
import { createContext, useState } from 'react'

const GlobalContext = createContext()

const ContextProvider = ({ children }) => {
    const [inputValue, setInputValue] = useState('')
    const [locationSearch, setLocationSearch] = useState([])
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [popupInfor, setPopupInfor] = useState(false)
    const [showButtonGroup, setShowButtonGroup] = useState(true)
    const [showSaved, setShowSaved] = useState(false)

    return (
        <GlobalContext.Provider
            value={{
                inputValue,
                setInputValue,
                locationSearch,
                setLocationSearch,
                selectedLocation,
                setSelectedLocation,
                setPopupInfor,
                popupInfor,
                setShowButtonGroup,
                showButtonGroup,
                showSaved,
                setShowSaved,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export { GlobalContext, ContextProvider }
