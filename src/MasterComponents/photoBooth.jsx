"use client"

import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, EffectCoverflow, Autoplay } from "swiper/modules"
import axios from "axios"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"
import { Link } from "react-router-dom"
import Headerlayout from "./HeaderLayout"
const photos = [
    {
        id: 1,
        src: "/hero.png",
        alt: "Fantasy Warrior 1",
        title: "Medieval Knight",
    },
    {
        id: 2,
        src: "/hero.png",
        alt: "Fantasy Warrior 2",
        title: "Royal Guardian",
    },
    {
        id: 3,
        src: "/hero.png",
        alt: "Fantasy Warrior 3",
        title: "Mystic Sorcerer",
    },
    {
        id: 4,
        src: "/hero.png",
        alt: "Fantasy Warrior 4",
        title: "Dragon Slayer",
    },
    {
        id: 5,
        src: "/hero.png",
        alt: "Fantasy Warrior 5",
        title: "Arcane Warrior",
    },
]
const PhotoBoothScreen = () => {
    const bg = './background.png'

    const [avatars, setAvatars] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeSlideIndex, setActiveSlideIndex] = useState(0)

    const data = JSON.parse(localStorage.getItem("userRegistration") || "{}")

    useEffect(() => {
        axios
            .get(
                `https://tagglabsapi.logarithm.co.in/TagglabsServer1api/avatars/avatar-list?projectId=6864bb25c6dce5f7bcf906ad&gender=${data?.gender || 2}&pageNumber=1&itemsPerPage=100`,
            )
            .then((res) => {
                const data = res.data.result || []

                // If exactly 2 avatars, add one dummy object


                setAvatars(data)
                setIsLoading(false)

                // Set initial active avatar
                if (data.length > 0) {
                    localStorage.setItem("activeAvatarId", data[0].avatarId)
                }
            })
            .catch((err) => {
                console.error("Failed to fetch avatars", err)
                setIsLoading(false)
            })
    }, [])

    const handleSlideClick = (slideId) => {
        localStorage.setItem("activeAvatarId", slideId)
    }

    const handleSlideChange = (swiper) => {
        setActiveSlideIndex(swiper.realIndex)
        const currentSlide = avatars[swiper.realIndex]
        if (currentSlide) {
            localStorage.setItem("activeAvatarId", currentSlide.avatarId)
        }
    }

    // Show loading state


    return (
        <div
            className=""
        >
            {/* Logo */}
            <div className=" ">
                <div className="md:px-[80px] px-[20px] min-h-screen  bg-cover bg-no-repeat h-full  text-center"
                    style={{ background: `url(${bg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}

                >
                    <div className=" flex flex-col items-center ">
                        <Link to='/'>   <img src="./logo.png" className="mt-[64px] md:w-[666px] md:h-[337px] w-[150px] h-[80px] z-50" /></Link>

                        <div className="mb-12 z-20">
                            <div className="swiper-pagination-custom flex justify-center gap-3"></div>
                        </div>

                        {/* Main Slider Container */}
                        <div className="relative w-full max-w-[1200px] mx-auto overflow-hidden">
                            <Swiper
                                onSlideChange={handleSlideChange}
                                onSwiper={(swiper) => {
                                    // Ensure first slide is active on initialization
                                    setTimeout(() => {
                                        swiper.slideTo(0, 0)
                                    }, 100)
                                }}
                                modules={[Pagination, EffectCoverflow, Autoplay]}
                                loop={true}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={2}
                                spaceBetween={-150}
                                initialSlide={0} // Always start with first slide
                                effect="coverflow"
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 1,
                                    slideShadows: false,
                                }}
                                pagination={{
                                    clickable: true,
                                    dynamicBullets: false,
                                    el: ".swiper-pagination-custom",
                                }}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 2,
                                        spaceBetween: -100,
                                    },
                                    768: {
                                        slidesPerView: 2,
                                        spaceBetween: -120,
                                    },
                                    1024: {
                                        slidesPerView: 2,
                                        spaceBetween: -150,
                                    },
                                }}
                                className="vida-swiper"
                            >
                                {photos.map((avatar, index) => (
                                    <SwiperSlide key={avatar.avatarId} className="vida-slide">
                                        <div
                                            className={`slide-card ${index === activeSlideIndex ? "active" : "inactive"}`}
                                            onClick={() => handleSlideClick(avatar.avatarId)}
                                        >
                                            <div className="card-inner">
                                                <img src={avatar.src || "/placeholder.svg"} alt="avatar" className="avatar-image" />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>


                        <div className="">
                            <Link to='/PhotoClick'>
                                <button
                                    className="
    bg-white 
    px-6 py-4 
    md:px-[150px] md:py-[37px]
    md:rounded-[20px] 
rounded-[10px]
    uppercase boldCalibri 
    text-xl md:text-[72px] 
    text-black 
    leading-[28px] md:leading-[67px] 
 mt-[17px]
  "
                                >
                                    Next
                                </button>
                            </Link>

                            <p className="CalibriItalic text-white md:mt-[83px] mt-[30px] text-2xl md:text-[58px] mb-[50px]">
                                #abcd
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Pagination Dots */}


            {/* Custom Styles */}
            <style jsx>{`
        .vida-swiper {
          width: 100%;
          padding: 50px 0;
          overflow: visible;
        }

        .vida-slide {
          height: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .slide-card {
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-style: preserve-3d;
          position: relative;
        }

        .card-inner {
        //   background: rgba(255, 255, 255, 0.1);
        //   backdrop-filter: blur(10px);
        //   border: 10px solid rgba(255, 255, 255, 0.2);
        //   border-radius: 24px;
          overflow: hidden;
        //   box-shadow: 
        //     0 8px 32px rgba(0, 0, 0, 0.1),
        //     0 0 0 1px rgba(255, 255, 255, 0.1);
        //   transition: all 0.4s ease;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.4s ease;
        }

        /* Force active state on first slide initially */
        .slide-card.active,
        .vida-swiper .swiper-slide-active .slide-card {
          width: 479px;
          height: 664px;
          transform: scale(1) translateZ(50px);
          z-index: 10;
          opacity: 1;
        }

        .slide-card.active .card-inner,
        .vida-swiper .swiper-slide-active .card-inner {
        //   border: 15px solid rgba(255, 255, 255, 0.4);
        //   box-shadow: 
        //     0 20px 60px rgba(0, 0, 0, 0.3),
        //     0 0 0 1px rgba(255, 255, 255, 0.2),
        //     inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Inactive slides */
        .slide-card.inactive,
        .vida-swiper .swiper-slide:not(.swiper-slide-active) .slide-card {
          width: 320px;
          height: 440px;
          transform: scale(0.75) translateZ(-100px);
          opacity: 0.8;
          z-index: 5;
        }

        .slide-card.inactive .card-inner,
        .vida-swiper .swiper-slide:not(.swiper-slide-active) .card-inner {
        //   border: 15px solid rgba(255, 255, 255, 0.15);
        //   box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        /* Hover effects */
        .slide-card:hover {
          transform: scale(1.02) translateZ(20px) !important;
        }

        .slide-card.active:hover,
        .vida-swiper .swiper-slide-active .slide-card:hover {
          transform: scale(1.05) translateZ(70px) !important;
        }

        .slide-card.inactive:hover,
        .vida-swiper .swiper-slide:not(.swiper-slide-active) .slide-card:hover {
          transform: scale(0.8) translateZ(-80px) !important;
        }

        /* Pagination styling */
        .swiper-pagination-custom {
          position: relative !important;
          display: flex;
          justify-content: center;
          gap: 12px;
          z-index: 20;
        }

        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255, 255, 255, 0.6);
          background: transparent;
          border-radius: 50%;
          opacity: 1;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .swiper-pagination-custom .swiper-pagination-bullet-active {
          background: white;
          border-color: white;
          transform: scale(1.3);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
          .swiper-pagination-custom.flex.justify-center.gap-3.swiper-pagination-clickable.swiper-pagination-bullets.swiper-pagination-horizontal {
    display: none !important;
}

        .swiper-pagination-custom .swiper-pagination-bullet:hover {
          transform: scale(1.2);
          border-color: white;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 1023px) {
          .slide-card.active,
          .vida-swiper .swiper-slide-active .slide-card {
            width: 380px;
            height: 520px;
          }
          
          .slide-card.inactive,
          .vida-swiper .swiper-slide:not(.swiper-slide-active) .slide-card {
            width: 280px;
            height: 380px;
          }
        }

        @media (max-width: 767px) {
          .slide-card.active,
          .vida-swiper .swiper-slide-active .slide-card {
            width: 300px;
            height: 420px;
          }
          
          .slide-card.inactive,
          .vida-swiper .swiper-slide:not(.swiper-slide-active) .slide-card {
            width: 220px;
            height: 310px;
          }
          
          .swiper-pagination-custom .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
          }
        }

        @media (max-width: 480px) {
          .slide-card.active,
          .vida-swiper .swiper-slide-active .slide-card {
            width: 260px;
            height: 360px;
          }
          
          .slide-card.inactive,
          .vida-swiper .swiper-slide:not(.swiper-slide-active) .slide-card {
            width: 180px;
            height: 250px;
          }
          
          .vida-swiper {
            padding: 30px 0;
          }
        }

        @media (max-width: 360px) {
          .slide-card.active,
          .vida-swiper .swiper-slide-active .slide-card {
            width: 220px;
            height: 300px;
          }
          
          .slide-card.inactive,
          .vida-swiper .swiper-slide:not(.swiper-slide-active) .slide-card {
            width: 150px;
            height: 200px;
          }
        }

        /* Ensure proper positioning */
        .vida-swiper .swiper-slide {
          position: relative;
        }

        .vida-swiper .swiper-slide-active {
          z-index: 10;
        }

        .vida-swiper .swiper-slide:not(.swiper-slide-active) {
          z-index: 5;
        }

        .vida-swiper .swiper-wrapper {
          align-items: center;
        }
      `}</style>
        </div>
    )
}
export default PhotoBoothScreen