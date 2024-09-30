import React from 'react'

const EventDetailItem = ({ label, value }: { label: string | null; value: string | null }) => {
    return (
        <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
                <p>{label}</p>
                <p className='italic text-sm'>{value}</p>
            </div>
            <hr className="w-full border-t border-gray-500/70 my-2" />
        </div>
    )
}

export default EventDetailItem