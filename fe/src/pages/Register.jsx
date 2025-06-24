import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [preview, setPreview] = useState(null)
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    const validateForm = () => {
        const newErrors = {}
        if (!username) newErrors.username = 'Vui lòng nhập tên đăng nhập'
        if (!password) newErrors.password = 'Vui lòng nhập mật khẩu'
        if (!confirmPassword)
            newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatar(file)
            setPreview(URL.createObjectURL(file))
        } else {
            setAvatar(null)
            setPreview(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setErrors({})
        if (!validateForm()) return

        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        formData.append('confirmPassword', confirmPassword)
        if (avatar) formData.append('avatar', avatar)

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/register',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            )
            setMessage(response.data.message)
            setTimeout(() => navigate('/'), 2000)
        } catch (err) {
            setErrors({
                server: err.response?.data?.error || 'Đăng ký thất bại',
            })
        }
    }

    const getDefaultAvatar = () => {
        if (preview) return preview
        if (username)
            return `https://via.placeholder.com/100/007bff/ffffff?text=${username.charAt(0).toUpperCase()}`
        return 'https://via.placeholder.com/100/007bff/ffffff?text=U'
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4 text-2xl font-bold">
                                Đăng Ký
                            </h2>
                            <div className="text-center mb-3">
                                <img
                                    src={getDefaultAvatar()}
                                    alt="Avatar Preview"
                                    className="rounded-circle"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label
                                        htmlFor="avatar"
                                        className="form-label"
                                    >
                                        Ảnh đại diện
                                    </label>
                                    <input
                                        type="file"
                                        id="avatar"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="username"
                                        className="form-label"
                                    >
                                        Tên đăng nhập
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />
                                    {errors.username && (
                                        <div className="invalid-feedback">
                                            {errors.username}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="password"
                                        className="form-label"
                                    >
                                        Mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="form-label"
                                    >
                                        Xác nhận mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                    />
                                    {errors.confirmPassword && (
                                        <div className="invalid-feedback">
                                            {errors.confirmPassword}
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-success w-100 hover:bg-green-800"
                                >
                                    Đăng Ký
                                </button>
                            </form>
                            {message && (
                                <div
                                    className="alert alert-success mt-3"
                                    role="alert"
                                >
                                    {message}
                                </div>
                            )}
                            {errors.server && (
                                <div
                                    className="alert alert-danger mt-3"
                                    role="alert"
                                >
                                    {errors.server}
                                </div>
                            )}
                            <p className="text-center mt-3">
                                Đã có tài khoản?{' '}
                                <a
                                    href="/"
                                    className="text-green-500 hover:underline"
                                >
                                    Đăng nhập tại đây
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
