import { FaPlay } from "react-icons/fa";

const PlayButton = () => {
    return(
        <button
            className="
                rounded-full
                transition
                opacity-0
                flex
                items-center
                bg-green-500
                p-4
                translate
                translate-y-1/4
                group-hover:translate-y-0
                group-hover:opacity-100
                hover:scale-110
                cursor-pointer">
            <FaPlay className="text-black" size={20} />
        </button>
    )
}

export default PlayButton;