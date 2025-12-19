import { useState } from 'react';
import { createStoreType } from '@/shared/api/stores';

export default function CreateStoreTypeForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            await createStoreType({ name, description });
            setMessage('Store Type created successfully!');
            setName('');
            setDescription('');
        } catch (error) {
            console.error(error);
            setMessage('Failed to create Store Type.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='p-4 border rounded shadow bg-white'>
            <h2 className='text-lg font-bold mb-4'>Create Store Type</h2>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Name</label>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border'
                        required
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Description</label>
                    <input
                        type='text'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border'
                        required
                    />
                </div>
                <button
                    type='submit'
                    disabled={isLoading}
                    className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400'
                >
                    {isLoading ? 'Creating...' : 'Create'}
                </button>
                {message && <p className='text-sm text-center mt-2'>{message}</p>}
            </form>
        </div>
    );
}
