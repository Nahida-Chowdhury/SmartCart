<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->imagen== ""){
            return "";
        }

        return asset('/uploads/products/small/'.$this->image);
    }
}
