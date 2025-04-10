


export default function Table ({children}) {


    return <div className=" box-border">
        <table className="w-[calc(100%-32px)] min-w-96 mx-4 rounded-lg overflow-hidden table-auto mt-4">
            {children}
        </table>
    </div>
}