import React, { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Avatar = ({ avatarUrl, username }) => {
    const navigate = useNavigate()
    const [imageError, setImageError] = useState(false)

    const getAvatar = () => {
        if (avatarUrl && !imageError) {
            return avatarUrl
        }
        const initial = username ? username.charAt(0).toUpperCase() : 'U'
        return `https://ui-avatars.com/api/?name=${initial}&background=007bff&color=fff&size=40`
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('avatar_url')
        localStorage.removeItem('username')
        navigate('/')
    }

    return (
        <Dropdown>
            <Dropdown.Toggle
                variant="link"
                id="dropdown-avatar"
                className="p-0"
            >
                <img
                    src={getAvatar()}
                    alt="Avatar"
                    className="rounded-full"
                    style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                    }}
                    onError={() => setImageError(true)}
                />
            </Dropdown.Toggle>
            <Dropdown.Menu className="flex flex-col items-center">
                <p className="text-sm text-center font-semibold mb-1 text-green-700">
                    @{username}
                </p>
                <Dropdown.Item
                    onClick={handleLogout}
                    className="text-center font-semibold "
                >
                    Đăng xuất
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default Avatar
