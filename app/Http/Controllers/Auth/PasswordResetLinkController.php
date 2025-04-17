<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class PasswordResetLinkController extends Controller
{
    /**
     * แสดงฟอร์มขอรีเซ็ตรหัสผ่าน
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของผู้ใช้
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // เราจะใช้ Password::sendResetLink เพื่อส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของผู้ใช้
        // หากส่งสำเร็จ เราจะส่งกลับไปยังหน้าฟอร์มพร้อมกับข้อความสถานะ
        // หากไม่สำเร็จ เราจะส่งกลับไปยังหน้าฟอร์มพร้อมกับข้อความแสดงข้อผิดพลาด
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return back()->with('status', __('auth.passwords.sent'));
        }

        // ในกรณีที่ไม่พบอีเมล หรือเกิดข้อผิดพลาดอื่นๆ
        $key = Str::lower(str_replace('passwords.', '', $status));
        return back()
            ->withInput($request->only('email'))
            ->withErrors(['email' => __("auth.passwords.{$key}")]);
    }
}
