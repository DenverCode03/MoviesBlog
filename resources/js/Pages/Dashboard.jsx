import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {usePage} from '@inertiajs/react';
import Base from "../Base"

export default function Dashboard() {

    const {success} = usePage().props
    console.log(success);
    
    return (
        <div className=''>
            <Head title="Dashboard" />
            <Base>
            
            </Base>

        </div>
    );
}
