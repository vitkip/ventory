<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class RegisterRequest extends FormRequest
{
    // ฟังก์ชันนี้จะใช้ในการกำหนดกฎการตรวจสอบข้อมูลที่ส่งเข้ามา
    public function authorize(): bool
    {
        return true;
    }

    // ฟังก์ชันนี้จะใช้ในการกำหนดกฎการตรวจสอบข้อมูลที่ส่งเข้ามา
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:' . User::class, 'alpha_dash:ascii'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'terms-of-service' => ['accepted']
        ];

        // Password::defaults() จะใช้กฎการตรวจสอบรหัสผ่านที่กำหนดไว้ในไฟล์ config/auth.php
        // โดยจะมีความยาวอย่างน้อย 8 ตัวอักษร และต้องมีตัวอักษรพิมพ์ใหญ่ ตัวอักษรพิมพ์เล็ก และตัวเลข
    }

    
    // ฟังก์ชันนี้แสดงค่าความหมายของกฎการตรวจสอบข้อมูลที่ส่งเข้ามา
    public function attributes(): array
    {
        return [
            'name' => 'ຊື່',
            'username' => 'ຊື່ຜູ້ໃຊ້',
            'email' => 'ອີເມລ',
            'password' => 'ລະຫັດຜ່ານ',
            'terms-of-service' => 'ຂໍ້ກຳນົດແລະເງື່ອນໄຂການໃຊ້ງານ',
        ];
    }

    // ฟังก์ชันนี้แสดงข้อความ terms ของกฎการตรวจสอบข้อมูลที่ส่งเข้ามา
    public function messages(): array
    {
        return [
            'terms-of-service.accepted' => 'ເຈົ້າຕ້ອງຍອມຮັບຂໍ້ກຳໜົດແລະເງື່ອນໄຂການໃຊ້ງານ',
        ];
    }
}