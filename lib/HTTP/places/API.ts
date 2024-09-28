/**
 * 다수 여행지 페칭하기
 * 필터값이 적용된 여행지를 가져오는 API입니다.
 */
import { BACKEND_ROUTES } from '@/lib/constants/routes'
import { Place } from '@/lib/types/Entity/place'
import { ArrangeChoiceType, StateChoicesType } from '@/lib/utils/hooks/useFilters'

import { attachQuery, Queries } from '../http'

const get_arrange = (arrange: ArrangeChoiceType): string => {
  switch (arrange) {
    case '댓글순':
      return '' // TODO: 추가해야함 (여행 계획)

    case '리뷰순':
      return 'reviews'

    case '방문자순':
      return 'numOfAdded'

    case '스크랩순':
      return '' // TODO: 추가해야함 (여행 계획)
    case '좋아요순':
      return '' // TODO: 추가해야함 (여행 계획)
    case '최신순':
      return '' // TODO: 추가해야함 (여행 계획)
    case '평점순':
      return 'star'
  }
}
interface fetchPlacesParams {
  searchInput: string
  states: Array<StateChoicesType>
  arrange: ArrangeChoiceType
  scrollNum: number
  isScrap: boolean
  accessToken: string
}

export type PlaceResponse = {
  placeId: number
  cityId: number
  address: string
  description: string
  imageSrc: string
  latitude: number
  likes: number
  longitude: number
  numOfAdded: number
  placeName: string
  ratingScore: number
  scraps: number
  star: number
  category: string
  subcategory: string
  tel: string
  zipcode: string
  scrapped: boolean
}
export type PlaceCardType = Omit<Place, 'duration' | 'order'>

export const SCROLL_SIZE = 12
export const fetchPlaces = async (
  params: fetchPlacesParams,
): Promise<{
  datas: PlaceCardType[]
  totalPages: number
}> => {
  const { searchInput, states, arrange, scrollNum, isScrap, accessToken } = params

  const queries: Queries = [
    {
      key: 'search',
      value: searchInput,
    },
    {
      key: 'sorts',
      value: get_arrange(arrange),
    },
    {
      key: 'pageSize',
      value: SCROLL_SIZE,
    },
    {
      key: 'pageNum',
      value: scrollNum,
    },
    {
      key: 'userScrapOnly',
      value: isScrap,
    },
  ]
  // states 추가하기
  states.forEach(state =>
    queries.push({
      key: 'state',
      value: state,
    }),
  )

  const API = BACKEND_ROUTES.PLACES.GENERAL

  const API_ROUTE = attachQuery(`/server${API.url}`, queries)

  let res: Response
  // #1. 그냥 여행지 + 유저가 스크랩한 여행지
  res = await fetch(API_ROUTE, {
    method: API.method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken as string,
    },
    credentials: 'include',
  })

  if (!res.ok) {
    const error = new Error('An error occurred while fetching places')
    error.message = await res.json()
    throw error
  }
  const { places, totalPages } = await res.json()
  const datas: PlaceCardType[] = places.map((place: PlaceResponse) => ({
    id: place.placeId,
    name: place.placeName,
    imgSrc: place.imageSrc,
    address: place.address,
    geo: {
      latitude: place.latitude,
      longitude: place.longitude,
    },
    tag: place.category,
    // duration 필요 없음(선택한 여행지에서 필요)
    stars: place.star,
    visitCnt: place.numOfAdded,
    // TODO: reviews 백엔드 로직 아직 없음
    reviews: ['여기 너무 좋아요~ 데이트 장소', '핫플핫플 핫핫'], // Dummy
    reviewCnt: 200, // Dummy

    isScraped: place.scrapped,
  }))
  console.log('FEtched datas', datas)
  console.log('Fetched totalPages', totalPages)

  return { datas, totalPages }
}
