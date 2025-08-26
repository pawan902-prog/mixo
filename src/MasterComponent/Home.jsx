import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const bgImage = "./bgforhomescreen.png"
    console.log(bgImage, 'bgImage')
    useEffect(() => {
        localStorage.clear()
        sessionStorage.clear()
    }, [])
    return (
        <>
            <div
                className="bg-cover min-h-screen bg-center bg-no-repeat w-full flex flex-col items-center"
                style={{
                    background: '#BBF3FD'
                    // backgroundImage: `url(${bgImage})`,
                }}
            >
                <div className="w-full md:max-w-none md:w-[768px] max-w-md  mx-auto">
                    <div className="pt-[87px] md:pt-[90px] w-full">
                        <div className="block md:hidden w-[311px] h-[157.88px] md:w-[400px] lg:w-[500px] md:mx-auto lg:mx-auto">
                            <img src="./logo.png" className="w-full h-auto object-contain" />
                        </div>

                        <div className="hidden md:block w-[768px] h-[422.88px] lg:mx-auto">
                            <img src="./logomd.png" className="w-full h-auto object-cover" />
                        </div>

                    </div>
                    <div className="pl-[30px] md:pl-0 md:pr-0 pr-[73px]  mt-[80px] md:mt-[46px] w-full">
                        <div className="">
                            <h3 className="TestNational2Bold  text-[33px] md:text-[33px]  leading-[36px] md:leading-[40px] lg:leading-[48px] text-[#213B55] tracking-[1px]">
                                Your Agenda, <br className="md:hidden block" />
                                Crafted by AI
                            </h3>
                        </div>
                        <div className="mt-[21px] md:mt-[24px] ">
                            <p className="text-[18px] md:text-[20px] leading-[28px] md:leading-[32px] lg:leading-[36px] text-[#213B55] TestNational2Regular">
                                Tell our clever AI what you're interested in, and it'll craft a custom agenda. Every moment at Xerocon can be designed for your success.                            </p>
                        </div>
                        <div className="mt-[43px] md:mt-[46px] w-[225px] h-[56px] mb-5 z-50 md:mx-auto">
                            <Link
                                to='/QuestionScreen'
                                onClick={() => localStorage.removeItem('userResponses')}
                            >
                                <img src="./agenda.png" className="object-cover" />


                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
export default Home