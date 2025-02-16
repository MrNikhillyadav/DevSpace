import { IoSettingsSharp } from "react-icons/io5";

export default function SettingsPage(){
    return (
        <div className="h-[600px] max-w-[800px] mx-auto p-4 rounded  shadow-sm text-center bg-white"> 
            <div className='flex justify-center items-center gap-2'>
                <IoSettingsSharp className="text-2xl text-primary "/>
                <h1> Settings </h1>
            </div>
        </div>
    )
}
