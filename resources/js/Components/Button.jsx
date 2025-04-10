



export default function Button ({children, style}) {

    return <div>
        <button className={"px-2 py-1 rounded-md font-bold text-lg hover:tracking-wider transition-all duration-100" + style}>
            {children}
        </button>
    </div>
}