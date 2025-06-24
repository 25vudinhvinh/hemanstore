import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    const validateForm = () => {
        const newErrors = {}
        if (!username) newErrors.username = 'Vui lòng nhập tên đăng nhập'
        if (!password) newErrors.password = 'Vui lòng nhập mật khẩu'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setErrors({})
        if (!validateForm()) return

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/login',
                { username, password }
            )
            setMessage(response.data.message)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('avatar_url', response.data.avatar_url || '')
            localStorage.setItem('username', response.data.username || username)
            localStorage.setItem('user_id', response.data.user_id || '')
            setTimeout(() => navigate('/home'), 2000)
        } catch (err) {
            setErrors({
                server: err.response?.data?.error || 'Đăng nhập thất bại',
            })
        }
    }

    return (
        <div className="max-w-sm mx-auto my-12 p-6 border border-gray-300 rounded-md shadow-md">
            <h2 className="text-center text-2xl font-semibold">Đăng Nhập</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-1">
                        Tên đăng nhập
                    </label>
                    <input
                        type="text"
                        id="username"
                        className={`w-full p-2 border rounded ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && (
                        <div className="text-red-500">{errors.username}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        id="password"
                        className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                        <div className="text-red-500">{errors.password}</div>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full p-2 bg-green-700 text-white rounded hover:bg-green-800"
                >
                    Đăng Nhập
                </button>
                {message && (
                    <div className="mt-2 text-green-700 text-center">
                        {message}
                    </div>
                )}
                {errors.server && (
                    <div className="mt-2 text-red-500 text-center">
                        {errors.server}
                    </div>
                )}
                <p className="text-center mt-4">
                    Chưa có tài khoản?{' '}
                    <a
                        href="/register"
                        className="text-green-700 hover:underline"
                    >
                        Đăng ký tại đây
                    </a>
                </p>
            </form>
        </div>
    )
}

export default Login
