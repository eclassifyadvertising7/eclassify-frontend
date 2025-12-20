"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export function OTPInput({ 
  length = 6, 
  value = "", 
  onChange, 
  disabled = false,
  className,
  ...props 
}) {
  const [otp, setOtp] = useState(Array(length).fill(""))
  const inputRefs = useRef([])

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      const otpArray = value.split("").slice(0, length)
      const paddedArray = [...otpArray, ...Array(length - otpArray.length).fill("")]
      setOtp(paddedArray)
    } else {
      setOtp(Array(length).fill(""))
    }
  }, [value, length])

  const handleChange = (index, digit) => {
    if (disabled) return
    
    // Only allow digits
    if (!/^\d*$/.test(digit)) return

    const newOtp = [...otp]
    newOtp[index] = digit

    setOtp(newOtp)
    
    // Call onChange with the complete OTP string
    const otpString = newOtp.join("")
    onChange?.(otpString)

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (disabled) return

    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous and clear it
        const newOtp = [...otp]
        newOtp[index - 1] = ""
        setOtp(newOtp)
        onChange?.(newOtp.join(""))
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
        onChange?.(newOtp.join(""))
      }
    }
    // Handle arrow keys
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
    // Handle paste
    else if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  const handlePaste = (e) => {
    if (disabled) return
    
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain")
    const digits = pastedData.replace(/\D/g, "").slice(0, length)
    
    if (digits) {
      const newOtp = Array(length).fill("")
      for (let i = 0; i < digits.length; i++) {
        newOtp[i] = digits[i]
      }
      setOtp(newOtp)
      onChange?.(newOtp.join(""))
      
      // Focus the next empty input or the last input
      const nextIndex = Math.min(digits.length, length - 1)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)} {...props}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg",
            "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
            "disabled:bg-gray-100 disabled:cursor-not-allowed",
            "transition-colors duration-200",
            digit && "border-primary bg-primary/5"
          )}
        />
      ))}
    </div>
  )
}