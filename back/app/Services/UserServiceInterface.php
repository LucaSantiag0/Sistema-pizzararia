<?php

namespace App\Services;

interface UserServiceInterface
{
    public function getAllUsers();
    public function getUserById(string $id);
    public function createUser(array $data);
    public function updateUser(string $id, array $data);
    public function deleteUser(string $id);
}