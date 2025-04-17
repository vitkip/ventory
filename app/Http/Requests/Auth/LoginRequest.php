<?php

namespace App\Http\Requests\Auth;

use Illuminate\Support\Str;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{

    // ฟังก์ชัน authorize() จะใช้เพื่อกำหนดว่า request นี้สามารถทำได้หรือไม่ โดยจะ return true เสมอ
    public function authorize(): bool
    {
        return true;
    }

    // ฟังก์ชัน rules() จะใช้เพื่อกำหนดกฎการตรวจสอบข้อมูลที่ผู้ใช้กรอกเข้ามาในฟอร์มเข้าสู่ระบบ
    // โดยจะตรวจสอบว่า email และ password ที่กรอกมาถูกต้องหรือไม่
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'exists:users,email'],
            'password' => ['required', 'string'],
        ];
    }

    // ฟังก์ชัน authenticate() จะใช้เพื่อทำการตรวจสอบข้อมูลการเข้าสู่ระบบของผู้ใช้ โดยจะทำการตรวจสอบว่า email และ password ที่กรอกมาถูกต้องหรือไม่
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    // ฟังก์ชันนี้จะใช้เพื่อกำหนดว่า request นี้สามารถทำได้หรือไม่ โดยตรวจสอบว่ามีการ login เกินจำนวนที่กำหนดหรือไม่
    public function ensureIsNotRateLimited(): void
    {
        // ตรวจสอบว่า request นี้มีการ login เกินจำนวนที่กำหนดหรือไม่
        // ถ้ามีการ login เกินจำนวนที่กำหนด จะทำการส่ง event Lockout และ throw ValidationException
        // ถ้าไม่เกินจำนวนที่กำหนด จะ return ออกไป
        // RateLimiter::tooManyAttempts($this->throttleKey(), 5) หมายถึงว่า ถ้ามีการ login เกิน 5 ครั้งใน 1 นาที จะถือว่ามีการ login เกินจำนวนที่กำหนด
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', ['seconds' => $seconds]),
        ]);
    }

    // ฟังก์ชันนี้ throttleKey() จะใช้เพื่อสร้าง key สำหรับการ throttle โดยจะใช้ email และ ip address ของผู้ใช้ในการสร้าง key
    public function throttleKey()
    {
        return Str::lower($this->input('email')) . '|' . $this->ip();
    }
}