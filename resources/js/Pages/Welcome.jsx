import { Head, Link, usePage } from '@inertiajs/react';
import Base from '../Base';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />

            <Base>
                <div className='h-[400px] flex justify-center items-center flex-col gap-4'>
                    <h1 className='font-extrabold text-4xl'>
                        Welcome to <span className="text-red-500 font-extrabold text-4xl">The movie</span>
                    </h1>
                    <p className='text-gray-600'>
                        the blog where you found all kind of movie, series and animes of the moment
                    </p>
                </div>

                <div>
                    <h1 className="text-gray-700 font-extrabold text-4xl text-center">
                        Our best movies
                    </h1>
                </div>
            </Base>
            
        </>
    );
}
