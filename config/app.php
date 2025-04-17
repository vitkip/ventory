<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application, which will be used when the
    | framework needs to place the application's name in a notification or
    | other UI elements where an application name needs to be displayed.
    |
    */

    'name' => env('APP_NAME', 'Laventory'),

    /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services the application utilizes. Set this in your ".env" file.
    |
    */

    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Application Debug Mode
    |--------------------------------------------------------------------------
    |
    | When your application is in debug mode, detailed error messages with
    | stack traces will be shown on every error that occurs within your
    | application. If disabled, a simple generic error page is shown.
    |
    */

    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | Application URL
    |--------------------------------------------------------------------------
    |
    | This URL is used by the console to properly generate URLs when using
    | the Artisan command line tool. You should set this to the root of
    | the application so that it's available within Artisan commands.
    |
    */

    'url' => env('APP_URL', 'http://localhost'),

    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default timezone for your application, which
    | will be used by the PHP date and date-time functions. The timezone
    | is set to "UTC" by default as it is suitable for most use cases.
    |
    */

    'timezone' => 'Asia/Bangkok',

    /*
    |--------------------------------------------------------------------------
    | การกำหนดค่าภาษาของแอปพลิเคชัน
    |--------------------------------------------------------------------------
    |
    | ภาษาของแอปพลิเคชันกำหนดภาษาเริ่มต้นที่จะถูกใช้โดยตัวให้บริการการแปล
    | คุณสามารถตั้งค่านี้เป็นภาษาใดก็ได้ที่จะได้รับการสนับสนุนโดยแอปพลิเคชัน
    | การตั้งค่านี้ทำให้ Laravel ใช้ภาษาที่กำหนดเป็นค่าเริ่มต้นอัตโนมัติ
    |
    */

    'locale' => env('APP_LOCALE', 'th'),

    /*
    |--------------------------------------------------------------------------
    | ภาษาสำรองของแอปพลิเคชัน
    |--------------------------------------------------------------------------
    |
    | ภาษาสำรองกำหนดภาษาที่จะใช้เมื่อภาษาปัจจุบันไม่พร้อมใช้งาน
    | คุณสามารถเปลี่ยนค่านี้ให้ตรงกับโฟลเดอร์ภาษาใดก็ได้ที่มีอยู่ในแอปพลิเคชัน
    | ถ้าไม่พบข้อความแปลในภาษาหลัก (locale) Laravel จะใช้ข้อความจากภาษาสำรองนี้แทน
    |
    */

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    /*
    |--------------------------------------------------------------------------
    | ภาษาสำหรับ Faker
    |--------------------------------------------------------------------------
    |
    | ภาษานี้จะถูกใช้โดยไลบรารี Faker PHP เมื่อสร้างข้อมูลจำลองสำหรับ database seeds
    | ตัวอย่างเช่น จะใช้เพื่อรับหมายเลขโทรศัพท์ท้องถิ่น ข้อมูลที่อยู่ถนน เป็นต้น
    |
    */

    'faker_locale' => env('APP_FAKER_LOCALE', 'en_US'),

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is utilized by Laravel's encryption services and should be set
    | to a random, 32 character string to ensure that all encrypted values
    | are secure. You should do this prior to deploying the application.
    |
    */

    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', env('APP_PREVIOUS_KEYS', ''))
        ),
    ],

    /*
    |--------------------------------------------------------------------------
    | Maintenance Mode Driver
    |--------------------------------------------------------------------------
    |
    | These configuration options determine the driver used to determine and
    | manage Laravel's "maintenance mode" status. The "cache" driver will
    | allow maintenance mode to be controlled across multiple machines.
    |
    | Supported drivers: "file", "cache"
    |
    */

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

];
