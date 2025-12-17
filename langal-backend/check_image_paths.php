<?php
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Checking Image Paths in Database ===\n\n";

// Check Farmers (user_profiles)
echo "Farmers (user_profiles):\n";
$farmers = DB::table('users')
    ->join('user_profiles', 'users.user_id', '=', 'user_profiles.user_id')
    ->where('users.user_type', 'farmer')
    ->whereNotNull('user_profiles.profile_photo_url')
    ->select('users.user_id', 'users.phone', 'user_profiles.profile_photo_url')
    ->limit(3)
    ->get();

foreach ($farmers as $farmer) {
    echo "  User ID: {$farmer->user_id}\n";
    echo "  Phone: {$farmer->phone}\n";
    echo "  Profile Photo Path: {$farmer->profile_photo_url}\n";
    echo "  Full URL: " . url('storage/' . $farmer->profile_photo_url) . "\n";
    echo "  File Exists: " . (file_exists(storage_path('app/public/' . $farmer->profile_photo_url)) ? 'YES' : 'NO') . "\n\n";
}

// Check Customers
echo "\nCustomers (user_profiles + nid_photo_url):\n";
$customers = DB::table('users')
    ->join('user_profiles', 'users.user_id', '=', 'user_profiles.user_id')
    ->where('users.user_type', 'customer')
    ->whereNotNull('user_profiles.profile_photo_url')
    ->select('users.user_id', 'users.phone', 'user_profiles.profile_photo_url', 'user_profiles.nid_photo_url')
    ->limit(3)
    ->get();

foreach ($customers as $customer) {
    echo "  User ID: {$customer->user_id}\n";
    echo "  Phone: {$customer->phone}\n";
    echo "  Profile Photo Path: {$customer->profile_photo_url}\n";
    echo "  Profile Photo URL: " . url('storage/' . $customer->profile_photo_url) . "\n";
    echo "  Profile File Exists: " . (file_exists(storage_path('app/public/' . $customer->profile_photo_url)) ? 'YES' : 'NO') . "\n";
    
    if ($customer->nid_photo_url) {
        echo "  NID Photo Path: {$customer->nid_photo_url}\n";
        echo "  NID Photo URL: " . url('storage/' . $customer->nid_photo_url) . "\n";
        echo "  NID File Exists: " . (file_exists(storage_path('app/public/' . $customer->nid_photo_url)) ? 'YES' : 'NO') . "\n";
    } else {
        echo "  NID Photo: Not uploaded\n";
    }
    echo "\n";
}

// Check Experts
echo "\nExperts (expert_qualifications):\n";
$experts = DB::table('users')
    ->join('user_profiles', 'users.user_id', '=', 'user_profiles.user_id')
    ->join('expert_qualifications', 'users.user_id', '=', 'expert_qualifications.user_id')
    ->where('users.user_type', 'expert')
    ->whereNotNull('user_profiles.profile_photo_url')
    ->select('users.user_id', 'users.phone', 'user_profiles.profile_photo_url', 'expert_qualifications.certification_document_url')
    ->limit(3)
    ->get();

foreach ($experts as $expert) {
    echo "  User ID: {$expert->user_id}\n";
    echo "  Phone: {$expert->phone}\n";
    echo "  Profile Photo Path: {$expert->profile_photo_url}\n";
    echo "  Profile Photo URL: " . url('storage/' . $expert->profile_photo_url) . "\n";
    echo "  Profile File Exists: " . (file_exists(storage_path('app/public/' . $expert->profile_photo_url)) ? 'YES' : 'NO') . "\n";
    
    if ($expert->certification_document_url) {
        echo "  Certification Path: {$expert->certification_document_url}\n";
        echo "  Certification URL: " . url('storage/' . $expert->certification_document_url) . "\n";
        echo "  Certification File Exists: " . (file_exists(storage_path('app/public/' . $expert->certification_document_url)) ? 'YES' : 'NO') . "\n";
    }
    echo "\n";
}

echo "=== Check Complete ===\n";
