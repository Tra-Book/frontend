'use client'

import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils/cn'

interface EmailCheckProps {
  setIsNext: Dispatch<SetStateAction<boolean>>
}

// Eamil Validation Check Function
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailRegex.test(email)
}

const EmailCheck = ({ setIsNext }: EmailCheckProps): ReactNode => {
  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [isSend, setIsSend] = useState<boolean>(false)
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true)
  const [isCodeVerfiy, setIsCodeVerify] = useState<boolean>(true)

  const onClickSendButton = async (): Promise<void> => {
    console.log(email)
    if (!validateEmail(email) || email.trim() === '') {
      setIsEmailValid(false)
      return
    }

    try {
      const res = await fetch('/auth/send-verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
        credentials: 'include',
      })

      const status = res.status

      switch (status) {
        case 200:
          setIsEmailValid(true)
          setIsSend(true)
          // modal로 바꿀 예정
          alert('이메일로 인증번호 발송 완료')
          return
        case 400:
          // modal로 바꿀 예정
          alert('이미 가입된 이메일입니다.')
          break
        default:
          alert('인증 이메일 전송이 실패하였습니다. 다시 시도해주세요')
          break
      }
    } catch (error) {
      alert('인증 이메일 전송이 실패하였습니다. 다시 시도해주세요')
    }
  }

  const onClickVerifyButton = async (): Promise<void> => {
    if (code.trim() === '') {
      setIsCodeVerify(false)
      return
    }

    try {
      const res = await fetch('/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          email: email,
        }),
        credentials: 'include',
      })

      const status = res.status

      switch (status) {
        case 200:
          setIsCodeVerify(true)
          return
        case 400:
          setIsCodeVerify(false)
          break
        default:
          alert('이메일 인증이 실패하였습니다. 다시 시도해주세요')
          break
      }
    } catch (error) {
      alert('이메일 인증이 실패하였습니다. 다시 시도해주세요')
    }
  }

  useEffect(() => {
    setIsNext(prev => false)
  }, [])

  useEffect(() => {
    if (isCodeVerfiy && isSend) setIsNext(true)
  }, [isCodeVerfiy])

  return (
    <>
      <div className='grid w-full items-center gap-1.5'>
        <Label htmlFor='email' className='mb-2'>
          이메일 <span className='text-red-600'>*</span>
        </Label>
        <div className='gap flex justify-between gap-2'>
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type='text'
            id='email'
            placeholder=''
            className={cn('h-13 bg-tbPlaceholder shadow-tb-shadow', !isEmailValid && 'ring-2 ring-red-600')}
          />
          <Button onClick={onClickSendButton} variant='primary' className='h-13 w-1/5 p-2'>
            {!isSend ? '전송' : '재전송'}
          </Button>
        </div>
        <p className={cn(isEmailValid ? 'invisible' : 'pl-3 pt-1 text-sm text-red-600')}>
          * 올바른 이메일 형식이 아닙니다
        </p>
      </div>

      <div className='grid w-full items-center gap-1.5'>
        <Label htmlFor='code' className='mb-2'>
          인증번호 <span className='text-red-600'>*</span>
        </Label>
        <div className='gap flex justify-between gap-2'>
          <Input
            value={code}
            onChange={e => setCode(e.target.value)}
            type='text'
            id='code'
            placeholder=''
            className={cn('h-13 bg-tbPlaceholder shadow-tb-shadow', !isCodeVerfiy && 'ring-2 ring-red-600')}
          />
          <Button onClick={onClickVerifyButton} variant='primary' className='h-13 w-1/5 p-2'>
            확인
          </Button>
        </div>
        <p className={cn(isCodeVerfiy ? 'invisible' : 'pl-3 pt-1 text-sm text-red-600')}>
          * 올바른 인증번호가 아닙니다.
        </p>
      </div>

      <div className='mt-2 text-center text-slate-500'>
        혹시 메일을 받지 못하셨다면
        <br />
        재전송 버튼을 클릭해 주세요
      </div>
    </>
  )
}

export default EmailCheck