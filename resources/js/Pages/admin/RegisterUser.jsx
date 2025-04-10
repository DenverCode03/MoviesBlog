import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset, progress } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        image: null,
        password: '',
        password_confirmation: '',
    });

    const {auth} = usePage().props

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className='h-[100vh] w-full flex items-center justify-center flex-col gap-5'>
            {auth.user ? 
            <Head title="Create user" /> :
            <Head title="Register" />}

            {auth.user? 
                <h2 className='text-center text-red-500 text-2xl font-extrabold'>Create a New user</h2>:
                <h2 className='text-center text-gray-200 text-2xl font-extrabold'>Register</h2>
            }

            <form onSubmit={submit} className='w-[400px] py-7 px-8 bg-gray-100 rounded-lg text-red-500'>
                <div>
                    
                    {auth.user? 
                        <select name="role" id="role" className='rounded-md border-white w-full shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-white dark:text-gray-700 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 '>
                            <option value="author">Author</option>
                            <option value="admin">Admin</option>
                        </select>:
                        null
                    }

                </div>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone" value="Phone" />

                    <TextInput
                        id="phone"
                        name="phone"
                        value={data.phone}
                        className="mt-1 block w-full"
                        autoComplete="phone"
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />

                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="address" value="Address" />

                    <TextInput
                        id="address"
                        name="address"
                        value={data.address}
                        className="mt-1 block w-full"
                        autoComplete="address"
                        onChange={(e) => setData('address', e.target.value)}
                        required
                    />

                    <InputError message={errors.address} className="mt-2" />
                </div>
                
                <div>
                    <InputLabel htmlFor="image" value="Image" />

                    <input 
                        id="image"
                        name="image"
                        type="file"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('image', e.target.files[0])}
                        // required
                    />

                    <InputError message={errors.image} className="mt-2" />
                </div>                

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">

                    <PrimaryButton className="ms-4cw-full bg-red-500 text-white" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
