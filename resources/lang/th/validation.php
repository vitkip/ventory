<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'ກະລຸນາຍອມຮັບ :attribute',
'accepted_if' => 'ກະລຸນາຍອມຮັບ :attribute ເມື່ອ :other ເປັນ :value',
'active_url' => ':attribute ບໍ່ແມ່ນ URL ທີ່ຖືກຕ້ອງ',
'after' => ':attribute ຕ້ອງເປັນວັນທີຫຼັງຈາກ :date',
'after_or_equal' => ':attribute ຕ້ອງເປັນວັນທີຫຼັງ ຫຼື ເທົ່າກັບ :date',
'alpha' => ':attribute ຕ້ອງປະກອບດ້ວຍຕົວອັກສອນເທົ່ານັ້ນ',
'alpha_dash' => ':attribute ຕ້ອງປະກອບດ້ວຍຕົວອັກສອນ, ຕົວເລກ, ເຄື່ອງໝາຍຂີດກາງ ແລະ ເຄື່ອງໝາຍຂີດລາງ',
'alpha_num' => ':attribute ຕ້ອງປະກອບດ້ວຍຕົວອັກສອນ ແລະ ຕົວເລກ',
'array' => ':attribute ຕ້ອງເປັນອາເລ',
'before' => ':attribute ຕ້ອງເປັນວັນທີກ່ອນ :date',
'before_or_equal' => ':attribute ຕ້ອງເປັນວັນທີກ່ອນ ຫຼື ເທົ່າກັບ :date',
'between' => [
    'numeric' => ':attribute ຕ້ອງຢູ່ລະຫວ່າງ :min ແລະ :max',
    'file' => ':attribute ຕ້ອງມີຂະໜາດລະຫວ່າງ :min ແລະ :max ກິໂລໄບ',
    'string' => ':attribute ຕ້ອງມີຄວາມຍາວລະຫວ່າງ :min ແລະ :max ຕົວອັກສອນ',
    'array' => ':attribute ຕ້ອງມີຈໍານວນລະຫວ່າງ :min ແລະ :max ລາຍການ',
],
'boolean' => ':attribute ຕ້ອງເປັນຄ່າຈິງ ຫຼື ບໍ່ຈິງ',
'confirmed' => 'ການຢືນຢັນ :attribute ບໍ່ກົງກັນ',
'current_password' => 'ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
'date' => ':attribute ບໍ່ແມ່ນວັນທີທີ່ຖືກຕ້ອງ',
'date_equals' => ':attribute ຕ້ອງເປັນວັນທີ່ເທົ່າກັບ :date',
'date_format' => ':attribute ບໍ່ກົງກັບຮູບແບບ :format',
'declined' => ':attribute ຕ້ອງຖືກປະຕິເສດ',
'declined_if' => ':attribute ຕ້ອງຖືກປະຕິເສດເມື່ອ :other ເປັນ :value',
'different' => ':attribute ແລະ :other ຕ້ອງແຕກຕ່າງກັນ',
'digits' => ':attribute ຕ້ອງເປັນ :digits ຫຼັກ',
'digits_between' => ':attribute ຕ້ອງມີຈໍານວນຫຼັກລະຫວ່າງ :min ແລະ :max',
'dimensions' => ':attribute ມີຂະໜາດຮູບພາບບໍ່ຖືກຕ້ອງ',
'distinct' => ':attribute ມີຄ່າຊໍ້າກັນ',
'email' => ':attribute ຕ້ອງເປັນອີເມວທີ່ຖືກຕ້ອງ',
'ends_with' => ':attribute ຕ້ອງສິ້ນສຸດດ້ວຍ: :values',
'enum' => 'ຄ່າຂອງ :attribute ທີ່ເລືອກບໍ່ຖືກຕ້ອງ',
'exists' => 'ຄ່າຂອງ :attribute ທີ່ເລືອກບໍ່ຖືກຕ້ອງ',
'file' => ':attribute ຕ້ອງເປັນໄຟລ໌',
'filled' => ':attribute ຕ້ອງມີຄ່າ',
'gt' => [
    'numeric' => ':attribute ຕ້ອງຫຼາຍກ່ວາ :value',
    'file' => ':attribute ຕ້ອງມີຂະໜາດຫຼາຍກ່ວາ :value ກິໂລໄບ',
    'string' => ':attribute ຕ້ອງມີຄວາມຍາວຫຼາຍກ່ວາ :value ຕົວອັກສອນ',
    'array' => ':attribute ຕ້ອງມີຫຼາຍກ່ວາ :value ລາຍການ',
],'image' => ':attribute ຕ້ອງເປັນຮູບພາບ',
'in' => ':attribute ທີ່ເລືອກບໍ່ຖືກຕ້ອງ',
'in_array' => ':attribute ບໍ່ມີໃນ :other',
'integer' => ':attribute ຕ້ອງເປັນຈໍານວນເຕັມ',
'ip' => ':attribute ຕ້ອງເປັນທີ່ຢູ່ IP ທີ່ຖືກຕ້ອງ',
'ipv4' => ':attribute ຕ້ອງເປັນທີ່ຢູ່ IPv4 ທີ່ຖືກຕ້ອງ',
'ipv6' => ':attribute ຕ້ອງເປັນທີ່ຢູ່ IPv6 ທີ່ຖືກຕ້ອງ',
'json' => ':attribute ຕ້ອງເປັນຂໍ້ຄວາມ JSON ທີ່ຖືກຕ້ອງ',
'lt' => [
    'numeric' => ':attribute ຕ້ອງນ້ອຍກວ່າ :value',
    'file' => ':attribute ຕ້ອງມີຂະໜາດນ້ອຍກວ່າ :value ກິໂລໄບ',
    'string' => ':attribute ຕ້ອງມີຄວາມຍາວນ້ອຍກວ່າ :value ຕົວອັກສອນ',
    'array' => ':attribute ຕ້ອງມີນ້ອຍກວ່າ :value ລາຍການ',
],
'lte' => [
    'numeric' => ':attribute ຕ້ອງນ້ອຍກວ່າ ຫຼື ເທົ່າກັບ :value',
    'file' => ':attribute ຕ້ອງມີຂະໜາດນ້ອຍກວ່າ ຫຼື ເທົ່າກັບ :value ກິໂລໄບ',
    'string' => ':attribute ຕ້ອງມີຄວາມຍາວນ້ອຍກວ່າ ຫຼື ເທົ່າກັບ :value ຕົວອັກສອນ',
    'array' => ':attribute ບໍ່ຄວນມີຫຼາຍກວ່າ :value ລາຍການ',
],
'mac_address' => ':attribute ຕ້ອງເປັນທີ່ຢູ່ MAC ທີ່ຖືກຕ້ອງ',
'max' => [
    'numeric' => ':attribute ບໍ່ຄວນຫຼາຍກວ່າ :max',
    'file' => ':attribute ບໍ່ຄວນມີຂະໜາດເກີນ :max ກິໂລໄບ',
    'string' => ':attribute ບໍ່ຄວນມີຄວາມຍາວເກີນ :max ຕົວອັກສອນ',
    'array' => ':attribute ບໍ່ຄວນມີເກີນ :max ລາຍການ',
],
'mimes' => ':attribute ຕ້ອງເປັນໄຟລ໌ປະເພດ: :values',
'mimetypes' => ':attribute ຕ້ອງເປັນໄຟລ໌ປະເພດ: :values',
'min' => [
    'numeric' => ':attribute ຕ້ອງມີຄ່າຢ່າງນ້ອຍ :min',
    'file' => ':attribute ຕ້ອງມີຂະໜາດຢ່າງນ້ອຍ :min ກິໂລໄບ',
    'string' => ':attribute ຕ້ອງມີຄວາມຍາວຢ່າງນ້ອຍ :min ຕົວອັກສອນ',
    'array' => ':attribute ຕ້ອງມີຢ່າງນ້ອຍ :min ລາຍການ',
],
'multiple_of' => ':attribute ຕ້ອງເປັນຜົນຄູນຂອງ :value',
'not_in' => ':attribute ທີ່ເລືອກບໍ່ຖືກຕ້ອງ',
'not_regex' => 'ຮູບແບບຂອງ :attribute ບໍ່ຖືກຕ້ອງ',
'numeric' => ':attribute ຕ້ອງເປັນຕົວເລກ',
'password' => 'ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
'present' => ':attribute ຕ້ອງມີ',
'prohibited' => ':attribute ບໍ່ໄດ້ຮັບອະນຸຍາດ',
'prohibited_if' => ':attribute ບໍ່ໄດ້ຮັບອະນຸຍາດເມື່ອ :other ເປັນ :value',
'prohibited_unless' => ':attribute ບໍ່ໄດ້ຮັບອະນຸຍາດ ເວັ້ນແຕ່ :other ຢູ່ໃນ :values',
'prohibits' => ':attribute ບໍ່ອະນຸຍາດໃຫ້ມີ :other',
'regex' => 'ຮູບແບບຂອງ :attribute ບໍ່ຖືກຕ້ອງ',
'required' => 'ກະລຸນາປ້ອນ :attribute',
'required_array_keys' => ':attribute ຕ້ອງມີລາຍການສໍາລັບ: :values',
'required_if' => ':attribute ຈໍາເປັນເມື່ອ :other ເປັນ :value',
'required_unless' => ':attribute ຈໍາເປັນ ເວັ້ນແຕ່ :other ຢູ່ໃນ :values',
'required_with' => ':attribute ຈໍາເປັນເມື່ອມີ :values',
'required_with_all' => ':attribute ຈໍາເປັນເມື່ອມີ :values ທັງໝົດ',
'required_without' => ':attribute ຈໍາເປັນເມື່ອບໍ່ມີ :values',
'required_without_all' => ':attribute ຈໍາເປັນເມື່ອບໍ່ມີ :values ໃດໆ',
'same' => ':attribute ແລະ :other ຕ້ອງກົງກັນ',
'size' => [
    'numeric' => ':attribute ຕ້ອງເທົ່າກັບ :size',
    'file' => ':attribute ຕ້ອງມີຂະໜາດ :size ກິໂລໄບ',
    'string' => ':attribute ຕ້ອງມີຄວາມຍາວ :size ຕົວອັກສອນ',
    'array' => ':attribute ຕ້ອງມີ :size ລາຍການ',
],
'starts_with' => ':attribute ຕ້ອງເລີ່ມຕົ້ນດ້ວຍໜຶ່ງໃນ: :values',
'string' => ':attribute ຕ້ອງເປັນຂໍ້ຄວາມ',
'timezone' => ':attribute ຕ້ອງເປັນເຂດເວລາທີ່ຖືກຕ້ອງ',
'unique' => ':attribute ໄດ້ຖືກໃຊ້ແລ້ວ',
'uploaded' => ':attribute ອັບໂຫລດລົ້ມເຫຼວ',
'url' => ':attribute ຕ້ອງເປັນ URL ທີ່ຖືກຕ້ອງ',
'uuid' => ':attribute ຕ້ອງເປັນ UUID ທີ່ຖືກຕ້ອງ',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
    'name' => [
        'required' => 'ກະລຸນາປ້ອນຊື່ຂອງທ່ານ',
        'string' => 'ຊື່ຕ້ອງເປັນຂໍ້ຄວາມ',
        'max' => 'ຊື່ຕ້ອງມີຄວາມຍາວບໍ່ເກີນ :max ຕົວອັກສອນ',
    ],
    'username' => [
        'required' => 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ຂອງທ່ານ',
        'string' => 'ຊື່ຜູ້ໃຊ້ຕ້ອງເປັນຂໍ້ຄວາມ',
        'max' => 'ຊື່ຜູ້ໃຊ້ຕ້ອງມີຄວາມຍາວບໍ່ເກີນ :max ຕົວອັກສອນ',
        'unique' => 'ຊື່ຜູ້ໃຊ້ນີ້ຖືກໃຊ້ແລ້ວ',
        'alpha_dash' => 'ຊື່ຜູ້ໃຊ້ຕ້ອງປະກອບດ້ວຍຕົວອັກສອນ, ຕົວເລກ, ເຄື່ອງໝາຍຂີດກາງ ແລະ ເຄື່ອງໝາຍຂີດລາງເທົ່ານັ້ນ',
    ],
    'email' => [
        'required' => 'ກະລຸນາປ້ອນອີເມວຂອງທ່ານ',
        'string' => 'ອີເມວຕ້ອງເປັນຂໍ້ຄວາມ',
        'email' => 'ກະລຸນາປ້ອນອີເມວໃຫ້ຖືກຕ້ອງ',
        'max' => 'ອີເມວຕ້ອງມີຄວາມຍາວບໍ່ເກີນ :max ຕົວອັກສອນ',
        'unique' => 'ອີເມວນີ້ຖືກໃຊ້ແລ້ວ',
    ],
    'password' => [
        'required' => 'ກະລຸນາປ້ອນລະຫັດຜ່ານຂອງທ່ານ',
        'confirmed' => 'ການຢືນຢັນລະຫັດຜ່ານບໍ່ກົງກັນ',
    ],
    'terms-of-service' => [
        'required' => 'ກະລຸນາຍອມຮັບເງື່ອນໄຂແລະຂໍ້ກໍານົດການໃຊ້ງານ',
    ],
],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

        'attributes' => [
        'name' => 'ຊື່',
        'username' => 'ຊື່ຜູ້ໃຊ້',
        'email' => 'ອີເມວ',
        'password' => 'ລະຫັດຜ່ານ',
        'password_confirmation' => 'ຢືນຢັນລະຫັດຜ່ານ',
        'terms-of-service' => 'ເງື່ອນໄຂແລະຂໍ້ກໍານົດການໃຊ້ງານ',
    ],

]; 