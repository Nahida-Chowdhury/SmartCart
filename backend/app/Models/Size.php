<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    protected $fillable = ['name', 'status'];

    public function product_sizes()
    {
        return $this->hasMany(ProductSize::class);
    }
}
