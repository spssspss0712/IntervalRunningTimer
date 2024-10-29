'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  const [runTime, setRunTime] = useState(15)
  const [walkTime, setWalkTime] = useState(45)
  const [isRunning, setIsRunning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState('准备')
  const [timeLeft, setTimeLeft] = useState(3)
  const [isPreparing, setIsPreparing] = useState(false)
  
  const audioContext = useRef<AudioContext | null>(null)

  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    return () => {
      if (audioContext.current) {
        audioContext.current.close()
      }
    }
  }, [])

  const playSound = (frequency: number, duration: number = 0.5) => {
    if (audioContext.current) {
      const oscillator = audioContext.current.createOscillator()
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime)
      
      const gainNode = audioContext.current.createGain()
      gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + duration)
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.current.destination)
      
      oscillator.start()
      oscillator.stop(audioContext.current.currentTime + duration)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning || isPreparing) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 1) {
            if (isPreparing) {
              playSound(1760, 0.1)
            } else if (currentPhase === '跑步') {
              playSound(880)
            } else if (currentPhase === '走路' && prevTime <= 4) {
              playSound(1760) // 只在走路阶段最后3秒播放高音提示
            }
            return prevTime - 1
          } else {
            if (isPreparing) {
              setIsPreparing(false)
              setCurrentPhase('跑步')
              playSound(880)
              return runTime
            } else {
              const nextPhase = currentPhase === '跑步' ? '走路' : '跑步'
              setCurrentPhase(nextPhase)
              if (nextPhase === '跑步') {
                playSound(880)
              }
              return nextPhase === '跑步' ? runTime : walkTime
            }
          }
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPreparing, currentPhase, runTime, walkTime])

  const toggleTimer = () => {
    if (!isRunning) {
      setIsPreparing(true)
      setCurrentPhase('准备')
      setTimeLeft(3)
      setIsRunning(true)
      playSound(1760, 0.1)
    } else {
      setIsRunning(false)
      setCurrentPhase('准备')
      setTimeLeft(3)
      setIsPreparing(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">间歇跑步计时器</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">跑步时间: {runTime} 秒</label>
          <Slider
            min={0}
            max={60}
            step={5}
            value={[runTime]}
            onValueChange={(value) => setRunTime(value[0])}
            disabled={isRunning}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">走路时间: {walkTime} 秒</label>
          <Slider
            min={0}
            max={60}
            step={5}
            value={[walkTime]}
            onValueChange={(value) => setWalkTime(value[0])}
            disabled={isRunning}
          />
        </div>
        <div className={`text-center space-y-2 ${
          currentPhase === '跑步' ? 'text-red-500' : 
          currentPhase === '走路' ? 'text-green-500' : 
          'text-blue-500'
        }`}>
          <div className="text-4xl font-bold">{currentPhase}</div>
          <div className="text-6xl font-bold tabular-nums">
            {timeLeft}
          </div>
        </div>
        <Button 
          className="w-full text-lg py-6" 
          onClick={toggleTimer}
          disabled={isPreparing}
        >
          {isRunning ? '停止' : isPreparing ? '准备中...' : '开始'}
        </Button>
      </CardContent>
    </Card>
  )
}