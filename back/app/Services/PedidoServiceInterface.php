<?php

namespace App\Services;

interface PedidoServiceInterface {
    public function getAllPedidos();
    public function createPedido(array $data);
    public function getPedidoById($id);
    public function updatePedido($pedido, array $data);
    public function deletePedido($pedido);
}
