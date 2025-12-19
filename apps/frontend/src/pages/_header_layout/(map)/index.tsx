import SearchBar from '@/shared/ui/search-bar/search-bar.ui'
import { createFileRoute } from '@tanstack/react-router'
import { Map } from 'react-kakao-maps-sdk'

export const Route = createFileRoute('/_header_layout/(map)/')({
  component: MapPage,
})

function MapPage() {

  return <div className='w-full h-full relative'>
    <div className='absolute top-5 w-full h-10 z-10 px-3'>
      <SearchBar/>
    </div>
    <Map // 지도를 표시할 Container
        id="map"
        center={{
          // 지도의 중심좌표
          lat: 33.450701,
          lng: 126.570667,
        }}
        style={{
          // 지도의 크기
          width: "100%",
          height: "100vh",
        }}
        level={3} // 지도의 확대 레벨
      />
      </div>
}
