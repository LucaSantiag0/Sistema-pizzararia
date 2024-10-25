<?php

namespace App\Http\Controllers;

use App\Services\PedidoServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PedidoController extends Controller
{
    protected PedidoServiceInterface $pedidoService;

    public function __construct(PedidoServiceInterface $pedidoService)
    {
        $this->pedidoService = $pedidoService;
    }

    /**
     * Exibe uma lista de todos os pedidos.
     */
    public function index(): JsonResponse
    {
        $pedidos = $this->pedidoService->getAllPedidos();
        return response()->json($pedidos);
    }

    /**
     * Armazena um novo pedido no banco de dados.
     */
    public function store(Request $request): JsonResponse
    {
        // Validação dos dados de entrada
        $this->validate($request, [
            'cliente' => 'required|string|max:255',
            'endereco' => 'required|string|max:255',
            'valor' => 'required|numeric',
            'status' => 'required|string|max:50',
        ]);

        // Cria o pedido e armazena no banco
        $pedido = $this->pedidoService->createPedido($request->all());

        // Retorna o pedido criado em formato JSON com código de status 201 (Criado)
        return response()->json($pedido, 201);
    }
}