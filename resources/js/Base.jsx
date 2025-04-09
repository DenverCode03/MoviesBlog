import { Button } from "@headlessui/react"
import { Link, router, usePage } from "@inertiajs/react"


export default function Base({children}) {

    const {auth} = usePage().props

    function logout (e) {
        e.preventDefault()
        // alert('r')
        router.post(route('logout'))
    }

    return <div>
        <header className="flex justify-between shadow-md p-5 sm:px-20 lg:px-40">

            <span className="text-red-500 font-extrabold text-2xl">
                The Movies
            </span>

            <div>
                {auth.user ? 
                        <form action="" onSubmit={logout}>
                            <button className="text-gray-700 hover:text-red-500 font-bold px-3 py-1 rounded-md">Log out</button>
                        </form>
                    :
                    <div className="flex justify-center gap-6">
                        <Link href={route('register')}> <button className="text-gray-700 hover:text-red-500 font-bold px-3 py-1 rounded-md">Register</button></Link>
                        <Link href={route('login')}> <button className="bg-red-500 text-white font-bold px-3 py-1 rounded-md">Log in</button></Link>
                    </div>
                }
            </div>

        </header>

        <div>
            {children}
        </div>
    </div>

}