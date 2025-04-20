<?php

namespace App\Core\Contracts;

interface BookmarksQueryService
{
    /**
     * Get all bookmarks
     *
     * @return array
     */
    public function getBookmarks(): array;
} 