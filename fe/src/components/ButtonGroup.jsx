import { useContext, useEffect, useState } from 'react'
import Button from './Button'
import axios from 'axios'
import { GlobalContext } from '../context/GlobalContext'

function ButtonGroup() {
    const [category, setCategory] = useState([])
    const { setInputValue } = useContext(GlobalContext)

    const handleButton = (e) => {
        setInputValue(e.target.innerText)
    }
    useEffect(() => {
        axios.get('http://localhost:5000/category').then((res) => {
            setCategory(res.data)
        })
    }, [])

    return (
        <div
            tabIndex="-1"
            className="w-full h-full flex items-center overflow-x-scroll scrollbar-hidden justify-around gap-3"
        >
            {category.map((item, key) => {
                return (
                    <Button onClick={handleButton} key={key} text={item.name} />
                )
            })}
        </div>
    )
}

export default ButtonGroup
