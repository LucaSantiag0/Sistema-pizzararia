<?php
namespace App\Http\Controllers;

use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Services\UserServiceInterface;
use Illuminate\Http\JsonResponse;

/**
 * Class UserController
 *
 * @package App\Http\Controllers
 * @author Vinícius Siqueira
 * @link https://github.com/ViniciusSCS
 * @date 2024-08-23 21:48:54
 * @copyright UniEVANGÉLICA
 */


class UserController extends Controller
{
    protected UserServiceInterface $userService;

    public function __construct(UserServiceInterface $userService)
    {
        $this->userService = $userService;
    }

    public function index(): JsonResponse
    {
        $users = $this->userService->getAllUsers();
        return response()->json([
            'status' => 200,
            'message' => 'Usuários encontrados!',
            'users' => $users,
        ]);
    }

    public function me(): JsonResponse
    {
        $user = $this->userService->getCurrentUser();
        return response()->json([
            'status' => 200,
            'message' => 'Usuário logado!',
            'user' => $user,
        ]);
    }

    public function store(UserCreateRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->all());
        return response()->json([
            'status' => 201,
            'message' => 'Usuário cadastrado com sucesso!',
            'user' => $user,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'Usuário não encontrado!',
            ]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Usuário encontrado com sucesso!',
            'user' => $user,
        ]);
    }

    public function update(UserUpdateRequest $request, string $id): JsonResponse
    {
        $user = $this->userService->updateUser($id, $request->all());

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'Usuário não encontrado!',
            ]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Usuário atualizado com sucesso!',
            'user' => $user,
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $result = $this->userService->deleteUser($id);

        if (!$result) {
            return response()->json([
                'status' => 404,
                'message' => 'Usuário não encontrado!',
            ]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Usuário deletado com sucesso!',
        ]);
    }
}
