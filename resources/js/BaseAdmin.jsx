import { usePage, router, Link } from "@inertiajs/react";
import { House, User } from "lucide-react";


export default function BaseAdmin ({children}) {

    const {auth} = usePage().props

    return <div className="relative">
        <Header></Header>
        <Sidbar></Sidbar>
        <div className="w-full md:left-[250px] md:w-[calc(100%-260px)] relative right-0 mt-10">
            {children}
        </div>
    </div>

}


function Header () {

    
    function logout (e) {
        e.preventDefault()
        // alert('r')
        router.post(route('logout'))
    }


    return <div>

        <header className="w-full px-5 flex justify-between items-center relative right-0 md:left-[250px] md:w-[calc(100%-260px)] shadow-md h-14 rounded-lg md:top-2 md:right-2">
            <span className="text-red-500 font-extrabold text-2xl">
                The Movies
            </span>
            
            <form action="" onSubmit={logout}>
                <button className="text-gray-700 hover:text-red-500 font-bold px-3 py-1 rounded-md">Log out</button>
            </form>
        </header>

    </div>

}

function Sidbar () {

    const {auth} = usePage().props

    return <div>
        <div className="fixed top-0 left-2 w-[230px] h-full hidden md:block transition-all duration-200 rounded-lg z-20 border shadow-lg ">

            <div className="w-full flex justify-center items-center gap-2 flex-col mt-14">
                <img src={auth.user.image} alt={auth.user.image} className="w-28 h-28 rounded-full" />
                <h2 className="text-md font-bold text-center text-red-500">{ auth.user.role }</h2>
                <h2 className="text-lg relative -top-3 font-bold text-center text-gray-800">{ auth.user.name }</h2>
            </div>

            <div className="w-full mt-6 px-3">

                <div className="w-full">
                    <Link href={route('admin.dashboard')} className="text-gray-700 block px-2 w-full hover:text-red-500 py-1 hover:bg-red-200 rounded-xl font-bold"><House size={16} className="inline mr-1 -top-[2px] relative"  strokeWidth={2.5} />Dashboard</Link>
                </div>

                <div className="w-full">
                    <Link href={route('admin.user')} className="text-gray-700 block hover:text-red-500 px-2 w-full py-1 hover:bg-red-200 rounded-xl font-bold"><User size={16} className="inline mr-1 -top-[2px] relative"  strokeWidth={2.5} />User</Link>
                </div>

            </div>

        </div>
    </div>
}