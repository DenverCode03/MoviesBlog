



export default function THead ({children}) {

    return <>
        <thead className="w-full border-red-400 overflow-hidden">

            <tr className="w-full rounded-t-lg bg-gray-100 h-11 border">
                {children}
            </tr>

        </thead>
    </>
}