"use client"

import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, EffectCoverflow, Autoplay } from "swiper/modules"
import axios from "axios"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"
import { Link, useNavigate } from "react-router-dom"
import Headerlayout from "./HeaderLayout"

const PhotoBoothScreen = () => {
  const bg = './background.png'
  const navigate = useNavigate()

  const [avatars, setAvatars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [selectedAvatarId, setSelectedAvatarId] = useState(null)

  const data = JSON.parse(localStorage.getItem("userRegistration") || "{}")
  const selectedGender = localStorage.getItem("selectedGender")

  // Map gender selection to API parameter (1 for male, 2 for female)
  const getGenderParam = () => {
    if (selectedGender === 'male') return 1
    if (selectedGender === 'female') return 2
    return 2 // default to female if no selection
  }

  useEffect(() => {
    // Fetch avatars from the new API endpoint
    const genderParam = getGenderParam()
    console.log('Fetching avatars for gender:', selectedGender, 'API param:', genderParam)

    // Show loading state while fetching
    setIsLoading(true)

    axios
      .get(
        `https://tagglabsapi.logarithm.co.in/TagglabsServer1api/avatars/avatar-list?projectId=68772bdaf74c1a12f0ae347b&gender=${genderParam}&pageNumber=1&itemsPerPage=100`,
      )
      .then((res) => {
        const avatarData = res.data.result || []
        setAvatars(avatarData)
        setIsLoading(false)

        // Set initial active avatar
        if (avatarData.length > 0) {
          const firstAvatarId = avatarData[0].avatarId
          setSelectedAvatarId(firstAvatarId)
          localStorage.setItem("activeAvatarId", firstAvatarId)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch avatars", err)
        setIsLoading(false)
      })
  }, [])

  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatarId(avatarId)
    localStorage.setItem("activeAvatarId", avatarId)
  }

  const handleSlideChange = (swiper) => {
    setActiveSlideIndex(swiper.realIndex)
    const currentSlide = avatars[swiper.realIndex]
    if (currentSlide) {
      setSelectedAvatarId(currentSlide.avatarId)
      localStorage.setItem("activeAvatarId", currentSlide.avatarId)
    }
  }

  const handleNextClick = () => {
    // Navigate to photo capture screen
    navigate('/PhotoClick')
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center"
        style={{ background: `url(${bg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
        <div className="text-white text-2xl">Loading avatars...</div>
      </div>
    )
  }

  // Show error state if no gender is selected
  if (!selectedGender) {
    return (
      <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center"
        style={{ background: `url(${bg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
        <div className="text-white text-center">
          <div className="text-2xl mb-4">Please select your gender first</div>
          <Link to="/genderSelection">
            <button className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100">
              Go to Gender Selection
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // Show error state if no avatars are available
  if (avatars.length === 0) {
    return (
      <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center"
        style={{ background: `url(${bg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
        <div className="text-white text-center">
          <div className="text-2xl mb-4">No avatars available for {selectedGender}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="">
      {/* Logo */}
      <div className=" ">
        <div className="md:px-[40px] px-[20px] min-h-screen  bg-cover bg-no-repeat h-full  text-center"
          style={{ background: `url(${bg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}

        >
          <div className=" flex flex-col items-center ">
            <Link to='/'>   <img src="./logo.png" className="mt-[64px] md:w-[666px] md:h-[337px] w-[150px] h-[80px] z-50" /></Link>

            <div className="mb-12 z-20">
              <div className="swiper-pagination-custom flex justify-center gap-3"></div>
            </div>

            {/* Main Slider Container */}
            <div className="relative w-full  mx-auto overflow-hidden">
              <div className="flex flex-col items-center gap-[39px]">
                {/* First 3 avatars */}
                <div className="grid md:grid-cols-3 gap-[39px] grid-cols-1">
                  {avatars.slice(0, 3).map((avatar, index) => (
                    <div
                      key={avatar.avatarId}
                      className={`slide-card relative ${index === activeSlideIndex ? "active" : "inactive"}`}
                      onClick={() => handleAvatarSelect(avatar.avatarId)}
                    >
                      <div className="card-inner border-[10px] border-[#8DB6D5] rounded-[30px] w-[301px] h-[448px] relative  overflow-hidden">
                        <img src={avatar.avatarURL || "/placeholder.svg"} alt="avatar" className="avatar-image object-cover" />

                        {/* Checkbox overlay */}
                        <div className="absolute top-4 right-4">
                          <div className={`w-[64px] h-[64px] rounded-full border-4 flex items-center justify-center transition-all duration-300 ${selectedAvatarId === avatar.avatarId
                            ? 'bg-[#0E2034] border-[#FFFFFF7D] border-[1px]'
                            : 'bg-white border-white'
                            }`}>
                            {selectedAvatarId === avatar.avatarId && (
                              <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M30.7601 5.73333L14.4667 24.2133C13.9334 24.812 13.1854 25.1733 12.3854 25.2267H12.2001C11.4654 25.2267 10.7441 24.9613 10.2001 24.4667L1.46539 16.7333C0.225388 15.6413 0.105388 13.72 1.21339 12.48C2.32005 11.228 4.22672 11.12 5.47872 12.228L11.9321 17.948L26.2267 1.73333C27.3334 0.493327 29.2401 0.373329 30.4921 1.46666C31.7321 2.57333 31.8521 4.47866 30.7601 5.73333Z" fill="white" />
                              </svg>

                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Last 2 avatars */}
                <div className="flex gap-[39px] justify-center flex-wrap
                ">
                  {avatars.slice(3).map((avatar, index) => (
                    <div
                      key={avatar.avatarId}
                      className={`slide-card relative ${index + 3 === activeSlideIndex ? "active" : "inactive"}`}
                      onClick={() => handleAvatarSelect(avatar.avatarId)}
                    >
                      <div className="card-inner border-[10px] border-[#8DB6D5] rounded-[30px] w-[301px] h-[448px] relative overflow-hidden">
                        <img src={avatar.avatarURL || "/placeholder.svg"} alt="avatar" className="avatar-image object-cover" />

                        {/* Checkbox overlay */}
                        <div className="absolute top-4 right-4">
                          <div className={`w-[64px] h-[64px] rounded-full border-4 flex items-center justify-center transition-all duration-300 ${selectedAvatarId === avatar.avatarId
                            ? 'bg-[#0E2034] border-[#FFFFFF7D] border-[1px]'
                            : 'bg-white border-white'
                            }`}>
                            {selectedAvatarId === avatar.avatarId && (
                              <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M30.7601 5.73333L14.4667 24.2133C13.9334 24.812 13.1854 25.1733 12.3854 25.2267H12.2001C11.4654 25.2267 10.7441 24.9613 10.2001 24.4667L1.46539 16.7333C0.225388 15.6413 0.105388 13.72 1.21339 12.48C2.32005 11.228 4.22672 11.12 5.47872 12.228L11.9321 17.948L26.2267 1.73333C27.3334 0.493327 29.2401 0.373329 30.4921 1.46666C31.7321 2.57333 31.8521 4.47866 30.7601 5.73333Z" fill="white" />
                              </svg>

                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>



            </div>


            <div className="">
              <button
                onClick={handleNextClick}
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
                                    md:mt-[99px]
                                    mt-[17px]
                                    hover:bg-gray-100
                                "
              >
                Next
              </button>

            </div>
          </div>
        </div>
      </div>

    </div >
  )
}
export default PhotoBoothScreen