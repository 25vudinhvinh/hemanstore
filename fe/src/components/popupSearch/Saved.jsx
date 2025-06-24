import { useContext, useState } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import saveIcon from '~/assets/add.svg'
import axios from 'axios'
function Saved() {
    const { setShowSaved } = useContext(GlobalContext)
    const [nameList, setNameList] = useState([])
    const [showPopup, setShowPopup] = useState(false)

    const userId = localStorage.getItem('user_id')
    axios
        .post('http://localhost:5000/saved/getlist', { userId })
        .then((res) => setNameList(res.data))

    return (
        <div className="min-w-2 p-2 min-h-2 absolute top-[55%] right-[6%] z-10 bg-gray-50 shadow-sm rounded">
            <p className="font-medium">Lưu vào danh sách của bạn</p>
            <button
                onClick={() => setShowPopup(true)}
                className="flex gap-2 items-center hover:bg-gray-100 w-full"
            >
                <img className="w-[25px]" src={saveIcon} alt="save" />
                <span>Danh sách mới</span>
            </button>
            {showPopup && (
                <div
                    onClick={() => setShowPopup(false)}
                    className="fixed top-0 right-0 left-0 bottom-0 bg-black bg-opacity-10 z-12"
                >
                    <div className="bg-white w-[100px] absolute h-[100px] top-50 left-50 "></div>
                </div>
            )}
        </div>
    )
}

export default Saved
