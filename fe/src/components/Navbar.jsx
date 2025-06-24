import saveIcon from '../assets/save.svg'
import historyIcon from '../assets/history.svg'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import saveGrennIcon from '~/assets/save-green.svg'
import historyGrennIcon from '~/assets/history-green.svg'
import { GlobalContext } from '../context/GlobalContext'

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [recent, setRecent] = useState(false)
    const [saved, setSaved] = useState(false)
    const { setLocationSearch, setShowButtonGroup, setSelectedLocation } =
        useContext(GlobalContext)
    useEffect(() => {
        if (location.pathname === '/home') {
            setRecent(false)
            setSaved(false)
        } else if (location.pathname === '/home/saved') {
            setSaved(true)
            setRecent(false)
        } else if (location.pathname === '/home/recent') {
            setRecent(true)
            setSaved(false)
        }
    }, [location.pathname])
    const handleClickSaved = () => {
        navigate('/home/saved')
        setLocationSearch([])
        setShowButtonGroup(false)
        setSelectedLocation([])
    }
    const handleClickRecent = () => {
        setLocationSearch([])
        navigate('/home/recent')
        setShowButtonGroup(false)
    }
    return (
        <div className="bg-blue-50 w-full h-full flex shadow-2xs flex-col gap-4 pt-25">
            <nav
                onClick={handleClickSaved}
                className="flex flex-col items-center hover:cursor-pointer select-none"
            >
                <img
                    className="w-[25px] h-[25px]"
                    src={saved ? saveGrennIcon : saveIcon}
                    alt="Đã lưu"
                />
                <p
                    className={`text-sm font-medium ${saved ? 'text-green-700' : null}`}
                >
                    Đã lưu
                </p>
            </nav>
            <nav
                onClick={handleClickRecent}
                className="flex flex-col items-center hover:cursor-pointer select-none"
            >
                <img
                    className="w-[25px] h-[25px]"
                    src={recent ? historyGrennIcon : historyIcon}
                    alt="Gần đây"
                />
                <p
                    className={`text-sm font-medium ${recent ? 'text-green-700' : null}`}
                >
                    Gần đây
                </p>
            </nav>
        </div>
    )
}

export default Navbar
