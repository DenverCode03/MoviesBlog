import BaseAdmin from "@/BaseAdmin";
import { useEffect, useState } from "react";
import Button from "@/Components/Button";
import Table from "@/Components/Table";
import THead from "@/Components/THead";
import TBody from "@/Components/TBody";
import { Link } from "@inertiajs/react";
import { ArrowDownUp, UserPlus } from "lucide-react";



export default function User ({user}) {

    const [search, setsearch] = useState('')

    return <BaseAdmin>
        <div className="relative pt-20">
            <SearchBar setsearch={setsearch}></SearchBar>
            <Title></Title>
            <Tab users={user} searchItem={search}></Tab>
        </div>
    </BaseAdmin>
}


function SearchBar ({setsearch}) {

    return <div>
        <input type="text" onChange={e => setsearch(e.target.value)} className="w-1/2 lg:w-1/3 h-11 top-2 rounded-md border focus:border-red-500 px-3 absolute right-2" placeholder="searh here" />
    </div>
}

function Title () {

    return <div>
        <div className="flex justify-between items-center px-8">
            <h2 className="text-gray-700 text-2xl font-bold">Users</h2>
            <Button style={" bg-red-500 text-white"}> <Link href={route('admin.register_user')}> <UserPlus size={16} strokeWidth={3} className="inline mr-1 -top-[2px] relative"  /> add </Link></Button>
        </div>
    </div>
}

function Tab ({users, searchItem}) {

    const [treatUsers, setTreatUsers] = useState([])
    const [nameAsc, setNameAsc] = useState(true)
    const [roleAsc, setRoleAsc] = useState(true)

    useEffect(() => {

        if (searchItem !== '') {
            let sort = users.filter((user) => {return user.name.toUpperCase().includes(searchItem.toUpperCase())})
            setTreatUsers(sort)
        }else{
            setTreatUsers(users)
        }

    }, [searchItem])

    function toggleOrderName () {

        setNameAsc(!nameAsc)
        let sort

        if (nameAsc) {
            sort = treatUsers.sort((a, b) => (a.name[0].toUpperCase() + a.name.slice(1).toLowerCase()).localeCompare(b.name[0].toUpperCase() + b.name.slice(1).toLowerCase()))
        }else {
            sort = treatUsers.sort((b, a) => (a.name[0].toUpperCase() + a.name.slice(1).toLowerCase()).localeCompare(b.name[0].toUpperCase() + b.name.slice(1).toLowerCase()))
        }
        
        setTreatUsers([...sort])
    }


    function toggleOrderRole () {
        
        setRoleAsc(!roleAsc)
        
        let sort

        if (roleAsc) {
            sort = treatUsers.sort((a, b) => (a.role[0].toUpperCase() + a.name.slice(1).toLowerCase()).localeCompare(b.role[0].toUpperCase() + b.name.slice(1).toLowerCase()))
        } else {
            sort = treatUsers.sort((b, a) => (a.role[0].toUpperCase() + a.name.slice(1).toLowerCase()).localeCompare(b.role[0].toUpperCase() + b.name.slice(1).toLowerCase()))
        }
        
        setTreatUsers([...sort])
    }

    return <Table>
        <THead>
            <th>#</th>
            <th className="flex items-center justify-center gap-2 h-11 cursor-pointer" onClick={toggleOrderName}>Name <ArrowDownUp size={16} strokeWidth={0.5} /></th>
            <th>Image</th>
            <th className="flex items-center justify-center gap-2 h-11 cursor-pointer"  onClick={toggleOrderRole}>Role <ArrowDownUp size={16} strokeWidth={0.5} /></th>
            <th>Action</th>
        </THead>
        <TBody>

            {treatUsers.map((user, index) => {
                return <tr className="text-center py-2 even:bg-red-50" key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td><img src={user.image} alt={user.image} className="w-9 h-9 rounded-md inline-block" /></td>
                    <td>{user.role}</td>
                    <td><Link href={route('admin.show_user', user.id)} className="px-2 py-1 font-bold bg-red-500 hover:bg-red-300 text-white rounded-md text-sm">Infos</Link></td>
                </tr>
            })}

        </TBody>
    </Table>
}