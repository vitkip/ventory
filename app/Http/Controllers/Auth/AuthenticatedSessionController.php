<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * แสดงฟอร์มเข้าสู่ระบบ
     *
     * @return \Inertia\Response
    */
    public function create(): Response
    {
        // ส่งฟอร์มเข้าสู่ระบบไปยัง view 'Auth/Login'
        // โดยใช้ Inertia เพื่อสร้าง response ที่เป็น JSON และส่งไปยัง client
        return Inertia::render('Auth/Login', [
            'status' => session('status'),
        ]);
    }


    /**
     * บันทึกข้อมูลการเข้าสู่ระบบ
     *
     * @param  \App\Http\Requests\Auth\LoginRequest  $request
     * @return \Illuminate\Http\RedirectResponse
    */
    public function store(LoginRequest $request): RedirectResponse
    {
        // ตรวจสอบข้อมูลการเข้าสู่ระบบของผู้ใช้
        $request->authenticate();

        // ลบข้อมูลการเข้าสู่ระบบเก่าใน session
        $request->session()->regenerate();

        // เปลี่ยนเส้นทางไปยังหน้า dashboard หรือหน้าที่คุณต้องการหลังจากเข้าสู่ระบบ
        // ในที่นี้เราจะเปลี่ยนเส้นทางไปยังหน้า dashboard
        return redirect()->route('dashboard');
    }


    /**
     * ออกจากระบบ
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
    */
    public function destroy(Request $request): RedirectResponse
    {
        // เมื่อคุณเรียกใช้ Auth::logout() โดยไม่ระบุ guard Laravel จะใช้ guard เริ่มต้นที่กำหนดไว้ในไฟล์ config/auth.php ซึ่งโดยทั่วไปคือ 'web' อยู่แล้ว
        Auth::logout();

        // ลบข้อมูลการเข้าสู่ระบบของผู้ใช้ใน session
        $request->session()->invalidate();

        // สร้าง token ใหม่สำหรับ session เพื่อป้องกันการโจมตี CSRF (Cross-Site Request Forgery)
        $request->session()->regenerateToken();

        // เปลี่ยนเส้นทางไปยังหน้าแรกหรือหน้าที่คุณต้องการหลังจากออกจากระบบ
        // ในที่นี้เราจะเปลี่ยนเส้นทางไปยังหน้า login
        return redirect()->route('login');
    }
}