function Button({ text, onClick }) {
    return (
        <div
            onClick={onClick}
            className="min-h-1 w-full hover:text-green-700 hover:scale-105 select-none bg-gray-50 cursor-pointer rounded-2xl p-2 font-medium text-sm flex items-center justify-center shadow-sm"
        >
            <button
                tabIndex="-1"
                className="inline-flex whitespace-nowrap select-none"
            >
                {text}
            </button>
        </div>
    )
}

export default Button
