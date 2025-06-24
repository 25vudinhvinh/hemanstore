import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../components/Avatar'
import Map from '../components/Map'
import Navbar from '../components/Navbar'

import Popup from '../components/popup/Popup'
import ButtonGroup from '../components/ButtonGroup'
import { GlobalContext } from '../context/GlobalContext'

const Home = () => {
    const token = localStorage.getItem('token')
    const avatar_url = localStorage.getItem('avatar_url')
    const username = localStorage.getItem('username') || 'User'
    const navigate = useNavigate()
    const { showButtonGroup } = useContext(GlobalContext)
    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [token, navigate])

    return (
        <div className="fixed right-0 left-0 bottom-0 top-0 flex">
            <div tabIndex="-1" className="w-[65px] ">
                <Navbar />
            </div>

            <div tabIndex="-1" className="flex-1 bg-white z-1">
                <Map />
            </div>

            <div tabIndex="-1" className="fixed left-[65px] top-0 w-[28%] z-2">
                <Popup />
            </div>
            {showButtonGroup && (
                <div
                    tabIndex="-1"
                    className="fixed left-[40%] w-[45%] px-3 top-6 z-10 overflow-x-hidden"
                >
                    <ButtonGroup />
                </div>
            )}
            <div tabIndex="-1" className="fixed right-[20px] top-3 z-10">
                <Avatar avatarUrl={avatar_url} username={username} />
            </div>
        </div>
    )
}

export default Home
