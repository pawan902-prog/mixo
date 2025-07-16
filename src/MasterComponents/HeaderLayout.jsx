import React from "react";
import { Link } from "react-router-dom";
const Headerlayout = ({ children }) => {
    const bg = './background.png'

    return (
        <>
            <div className=" ">
                <div
                    style={{ background: `url(${bg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
                    className={`md:px-[80px] px-[20px] min-h-screen bg-cover bg-no-repeat h-full flex justify-center`}>
                    <div className=" mt-[64px] flex flex-col items-center ">
                        <Link to='/'>   <img src="./logo.png" className="md:w-[666px] md:h-[337px] w-[150px] h-[80px] z-50" /></Link>
                        {children}
                    </div>
                </div>
            </div >
        </>
    )
}

export default Headerlayout