
import Image from "next/image"
import { Carousel } from "antd"
import { useRef, useState, useLayoutEffect } from "react"
import { useBanners } from '../../utils'

const BannerItem = ({ image, link }) => {
  const bannerRef = useRef()
  const [height, setHeight] = useState(350 * 1 / 2)
  const [width, setWidth] = useState(350)

  useLayoutEffect(() => {
    setWidth(bannerRef?.current?.offsetWidth || 350)
    setHeight(bannerRef?.current?.offsetWidth ? bannerRef?.current?.offsetWidth * 1 / 2 : 350 * 1 / 2)
  })
  const renderBanner = () => (
    <div
      ref={bannerRef}
      style={{
        minWidth: `${width}px` || '350px',
        height: `${height}px` || '150px',
        margin: '10px',
        borderRadius: '10px',
        boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)',
        overflow: 'hidden'
      }}>
      <Image
        unoptimized
        src={image.replace('/upload/', '/upload/q_50/')}
        alt=''
        width={width}
        height={height}
        objectFit='contain'
      // layout='responsive'
      />
    </div>
  )
  if (link) {
    return (
      <a href={link} target="_blank" rel="noreferrer">
        {renderBanner()}
      </a>
    )
  }
  return renderBanner()
}

const Banner = () => {
  const { banners: bannerList } = useBanners()
  if (!bannerList) return null

  return (
    <Carousel autoplay dots={false}>
      {bannerList.sort((a, b) => 0.5 - Math.random()).map((item, i) => <BannerItem key={i + 1} image={item.imageUrl} link={item.link} />)}
    </Carousel >
  )

}
export default Banner