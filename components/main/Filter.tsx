'use client'
import React, { ReactNode, useState } from 'react'

import { CITIES } from '@/lib/constants/regions'
import LucideIcon from '@/lib/icons/LucideIcon'
import { ReadOnly } from '@/lib/utils/typeUtils'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { IsFinishedChoicesType, StateChoicesType } from './Contents'

interface FilterProps {
  id: 'isFinished' | 'state' | 'stateCity'
  filter: Array<IsFinishedChoicesType> | Array<StateChoicesType>
  placeHolder: string
  choices: ReadOnly<Array<IsFinishedChoicesType>> | ReadOnly<Array<StateChoicesType>>
  handleFilters: (
    id: 'isFinished' | 'state' | 'all',
    type: 'change' | 'reset',
    filterValues?: Array<IsFinishedChoicesType> | Array<StateChoicesType>,
  ) => void
}

const Filter = ({ id, filter, placeHolder, choices, handleFilters }: FilterProps): ReactNode => {
  const [isOpen, setIsOpen] = useState<boolean>(false) // 드롭다운 열림 상태 관리
  const [isSaved, setIsSaved] = useState<boolean>(false) // 저장 여부 상태 관리
  const [checkedFilters, setCheckedFilters] = useState<Array<IsFinishedChoicesType> | Array<StateChoicesType>>(filter)

  const [selectedState, setSelectedState] = useState<StateChoicesType>('전체')
  const handleOpenChange = (open: boolean) => {
    // 열릴때 현재 상태 가져오기
    if (open) {
      setCheckedFilters(filter)
    }
    // 닫힐 떄 저장 버튼을 클릭하지 않았으면
    else {
      if (!isSaved) {
        setCheckedFilters(filter)
      }
    }
    setIsOpen(open)
  }

  const getChoices = () => {
    if (id !== 'stateCity') {
      return (
        <div className='min-h max-h-36 overflow-y-auto'>
          {choices.map(choice => (
            <div
              key={choice}
              className='flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-tbPlaceHolderHover focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 md:text-sm'
            >
              <Checkbox
                checked={checkedFilters.includes(choice as any) ? true : false}
                id={choice}
                className='border-tbGray data-[state=checked]:bg-white data-[state=checked]:text-tbPrimary'
                onClick={() => handleCheckBox(choice)}
              />
              <label htmlFor={choice} className='peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                {choice}
              </label>
            </div>
          ))}
        </div>
      )
    }
    // 여행지 필터
    else {
      choices = choices as ReadOnly<Array<StateChoicesType>> // Type Assertion
      return (
        <div className='relative flex items-start justify-between'>
          <div className='max-h-36 min-w-min overflow-y-auto'>
            {choices.map(choice => (
              <div
                key={choice}
                onClick={() => setSelectedState(choice)}
                className='flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-tbPlaceHolderHover focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 md:text-sm'
              >
                {/* <Checkbox
                  checked={checkedFilters.includes(choice as any) ? true : false}
                  id={choice}
                  className='border-tbGray data-[state=checked]:bg-white data-[state=checked]:text-tbPrimary'
                  onClick={() => handleCheckBox(choice)}
                /> */}
                {/* <label htmlFor={choice} className='peer-disabled:cursor-not-allowed peer-disabled:opacity-70'> */}
                {choice}
                {/* </label> */}
              </div>
            ))}
          </div>
          <div className='grid h-36 min-w-[200px] grid-cols-2 overflow-y-auto px-1 text-sm'>
            {selectedState !== '전체' ? (
              <>
                {/* 선택한 지역의 전체 버튼 */}
                <div className='flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-tbPlaceHolderHover focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 md:text-sm'>
                  <Checkbox
                    id={`${selectedState} 전체`}
                    className='border-tbGray data-[state=checked]:bg-white data-[state=checked]:text-tbPrimary'
                  />
                  <label htmlFor={`${selectedState} 전체`}>{`${selectedState.slice(0, 2)} 전체`}</label>
                </div>

                {/* 해당 지역의 세부 도시 목록 */}
                {CITIES[selectedState].map(city => (
                  <div
                    key={city}
                    className='flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-tbPlaceHolderHover focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 md:text-sm'
                  >
                    <Checkbox
                      id={city}
                      className='border-tbGray data-[state=checked]:bg-white data-[state=checked]:text-tbPrimary'
                    />
                    <label htmlFor={city}>{city}</label>
                  </div>
                ))}
              </>
            ) : (
              <div className='col-span-2 flex items-center justify-center text-base'>지역을 선택해주세요</div>
            )}
          </div>
        </div>
      )
    }
  }
  const handleCheckBox = (choice: IsFinishedChoicesType | StateChoicesType) => {
    setCheckedFilters(prev => {
      // "전체"를 선택한 경우, 나머지 선택 해제 후 "전체"만 선택
      if (choice === '전체') {
        return ['전체'] as typeof prev
      }

      // 다른 항목을 선택한 경우 "전체" 선택 해제
      let withoutAll = prev.filter(item => item !== '전체') as typeof prev
      if (withoutAll.includes(choice as any)) {
        withoutAll = withoutAll.filter(item => item !== choice) as typeof prev
      } else {
        withoutAll = [...withoutAll, choice] as typeof prev
      }

      // 나머지 모든 항목이 선택되면 "전체"를 자동으로 선택
      const allChoicesExceptAll = choices.filter(item => item !== '전체') // "전체"를 제외한 모든 선택지
      if (withoutAll.length === allChoicesExceptAll.length) {
        return ['전체'] as typeof prev // 모든 항목이 선택되었으므로 "전체"로 변경
      }

      return withoutAll
    })
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className='relative flex h-3/4 max-h-8 items-center justify-between gap-1 rounded-2xl border-[0.5px] border-solid border-black px-2'>
        <span>{placeHolder}</span>
        <LucideIcon name='ChevronDown' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {getChoices()}
        <DropdownMenuSeparator />
        <div className='relative flex items-center justify-end gap-4 p-2'>
          <Button
            variant='tbGray'
            className='w-1/2'
            onClick={() => {
              handleFilters(id, 'reset')
              setIsOpen(false)
            }}
          >
            초기화
          </Button>
          <Button
            variant='tbPrimary'
            className='w-1/2'
            onClick={() => {
              handleFilters(id, 'change', checkedFilters)
              setIsSaved(true)
              setIsOpen(false)
            }}
          >
            적용
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Filter
