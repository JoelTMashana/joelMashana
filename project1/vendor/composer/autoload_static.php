<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitd75edf425217bb4cea4ebf8e79379a38
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
            $loader->prefixLengthsPsr4 = ComposerStaticInitd75edf425217bb4cea4ebf8e79379a38::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitd75edf425217bb4cea4ebf8e79379a38::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitd75edf425217bb4cea4ebf8e79379a38::$classMap;

        }, null, ClassLoader::class);
    }
}