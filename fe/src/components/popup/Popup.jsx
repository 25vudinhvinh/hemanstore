import { useLocation } from 'react-router-dom'
import HomePopup from './HomePopup'
import RecentPopup from './RecentPopup'
import SavedPopup from './SavedPopup'

const popupMap = {
    '/home': HomePopup,
    '/home/saved': SavedPopup,
    '/home/recent': RecentPopup,
}

function Popup() {
    const location = useLocation()
    const PopupComponent =
        popupMap[location.pathname] ||
        (() => <div className="p-2 text-gray-500">Không tìm thấy popup</div>)

    return (
        <div>
            <PopupComponent />
        </div>
    )
}

export default Popup
