<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * แสดงฟอร์มรีเซ็ตรหัสผ่าน
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    /**
     * บันทึกรหัสผ่านใหม่
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // เราจะใช้ Password::reset เพื่อรีเซ็ตรหัสผ่านของผู้ใช้
        // หากรีเซ็ตรหัสผ่านสำเร็จ เราจะส่งกลับไปยังหน้าฟอร์มเข้าสู่ระบบ
        // หากไม่สำเร็จ เราจะส่งกลับไปยังหน้าฟอร์มพร้อมกับข้อความแสดงข้อผิดพลาด
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        // ถ้ารีเซ็ตรหัสผ่านสำเร็จ เราจะส่งกลับไปยังหน้าฟอร์มเข้าสู่ระบบ
        // หากไม่สำเร็จ เราจะส่งกลับไปยังหน้าฟอร์มพร้อมกับข้อความแสดงข้อผิดพลาด
        // หากสถานะไม่ใช่ PASSWORD_RESET เราจะโยน ValidationException
        if ($status != Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return redirect()->route('login')->with('status', __($status));
    }
}
