<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitee7b069f1b3675143be6b78e79f039ed
{
    public static $prefixLengthsPsr4 = array (
        'O' => 
        array (
            'OpenCage\\Geocoder\\' => 18,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'OpenCage\\Geocoder\\' => 
        array (
            0 => __DIR__ . '/..' . '/opencage/geocode/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitee7b069f1b3675143be6b78e79f039ed::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitee7b069f1b3675143be6b78e79f039ed::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitee7b069f1b3675143be6b78e79f039ed::$classMap;

        }, null, ClassLoader::class);
    }
}
