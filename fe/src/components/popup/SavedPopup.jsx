import closeIcon from '~/assets/close.svg'
import importainIcon from '~/assets/importain.svg'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { GlobalContext } from '../../context/GlobalContext'

const SavedPopup = () => {
    const navigate = useNavigate()
    const { setShowButtonGroup } = useContext(GlobalContext)
    return (
        <div className="w-full shadow-md bg-white">
            <div className="flex items-center justify-between">
                <h2 className="flex gap-1 items-center content-center opacity-85">
                    Đã lưu
                    <img
                        className="w-[20px] h-[20px]"
                        src={importainIcon}
                        alt=""
                    />
                </h2>
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
        </div>
    )
}

export default SavedPopup
