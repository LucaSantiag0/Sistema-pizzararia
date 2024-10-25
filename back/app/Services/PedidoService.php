<?php
namespace App\Services;

use App\Models\Pedido;

class PedidoService
{
    public function getAllPedidos()
    {
        return Pedido::all();
    }

    public function createPedido(array $data)
    {
        return Pedido::create($data);
    }

    public function getPedidoById($id)
    {
        return Pedido::findOrFail($id);
    }

    public function updatePedido(Pedido $pedido, array $data)
    {
        return $pedido->update($data);
    }

    public function deletePedido(Pedido $pedido)
    {
        return $pedido->delete();
    }
}