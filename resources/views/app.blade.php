<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    {{-- การเรียกใช้ route ของ ziggy  --}}
    @routes

    {{-- การทำ hot reload --}}
    @viteReactRefresh

    {{-- การเรียกใช้ component ของ react--}}
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    
    {{-- การเรียกใช้ head ของ inertia --}}
    @inertiaHead
  </head>
  <body>
    {{-- การเรียกใช้ component ของ react --}}
    @inertia
  </body>
</html>