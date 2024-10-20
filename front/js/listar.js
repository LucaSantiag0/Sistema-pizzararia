// Função para listar os usuários
async function listarUsuarios() {
    const token = localStorage.getItem('token');
    const userIdLogado = localStorage.getItem('userId');

    if (!token) {
        window.location.href = 'login.html'; // Redireciona se o token não existir
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/api/user/listar', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const usuarios = await response.json();
            const tabelaUsuarios = document.getElementById('tabelaUsuarios');
            tabelaUsuarios.innerHTML = ''; // Limpa a tabela

            // Adiciona cada usuário à tabela
            usuarios.user.data.forEach((usuario, index) => {
                const dataCriacao = new Date(usuario.created_at).toLocaleString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                });

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${usuario.name}</td>
                    <td>${usuario.email}</td>
                    <td>${dataCriacao}</td>
                    <td>
                        <button class="btn btn-info btn-sm visualizar-usuario" data-id="${usuario.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-info btn-sm editar-usuario" data-id="${usuario.id}">
                            <i class="fas fa-pencil"></i>
                        </button>
                        ${usuario.id != userIdLogado ? `
                            <button class="btn btn-danger btn-sm excluir-usuario" data-id="${usuario.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        ` : ''}
                    </td>
                `;
                tabelaUsuarios.appendChild(row);
            });

            adicionarEventos();
        } else {
            throw new Error('Erro ao buscar os usuários');
        }
    } catch (error) {
        exibirMensagemErro('Erro ao carregar a lista de usuários');
        console.error('Erro:', error);
    }
}

function adicionarEventos() {
    document.querySelectorAll('.excluir-usuario').forEach(button => {
        button.addEventListener('click', async function() {
            const userId = this.getAttribute('data-id');
            if (confirm('Tem certeza que deseja excluir este usuário?')) {
                await excluirUsuario(userId);
            }
        });
    });

    document.querySelectorAll('.visualizar-usuario').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            visualizarUsuario(userId);
        });
    });

    document.querySelectorAll('.editar-usuario').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            editarUsuario(userId);
        });
    });
}

async function excluirUsuario(userId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:8000/api/user/deletar/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Usuário excluído com sucesso!');
            listarUsuarios(); // Recarrega a lista de usuários
        } else {
            throw new Error('Erro ao excluir o usuário');
        }
    } catch (error) {
        alert('Erro ao excluir o usuário.');
        console.error('Erro:', error);
    }
}

function visualizarUsuario(userId) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/api/user/visualizar/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('usuarioNome').textContent = data.user.name;
        document.getElementById('usuarioEmail').textContent = data.user.email;
        document.getElementById('usuarioDataCriacao').textContent = new Date(data.user.created_at).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });
        new bootstrap.Modal(document.getElementById('visualizarUsuarioModal')).show();
    })
    .catch(error => console.error('Erro ao visualizar o usuário:', error));
}

function editarUsuario(userId) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/api/user/visualizar/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('usuarioNomeForm').value = data.user.name;
        document.getElementById('usuarioEmailForm').value = data.user.email;
        document.getElementById('usuarioCodigoForm').value = data.user.id;
        new bootstrap.Modal(document.getElementById('editarUsuarioModal')).show();
    })
    .catch(error => console.error('Erro ao editar o usuário:', error));
}

function atualizarUsuario() {
    const token = localStorage.getItem('token');
    const userId = document.getElementById('usuarioCodigoForm').value;
    const name = document.getElementById('usuarioNomeForm').value;
    const email = document.getElementById('usuarioEmailForm').value;
    const password = document.getElementById('usuarioSenhaForm').value;
    const password_confirmation = document.getElementById('usuarioConfirmaSenhaForm').value;

    fetch(`http://localhost:8000/api/user/atualizar/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, password_confirmation })
    })
    .then(response => response.json())
    .then(data => {
        exibirMensagemSucesso(data.message);
        listarUsuarios(); // Atualiza lista
    })
    .catch(error => {
        exibirMensagemErro('Erro ao atualizar o usuário');
        console.error('Erro ao editar o usuário:', error);
    });
}

function exibirMensagemErro(mensagem) {
    const mensagemErro = document.getElementById('mensagemErro');
    mensagemErro.textContent = mensagem;
    mensagemErro.classList.remove('d-none');
}

function exibirMensagemSucesso(mensagem) {
    const mensagemSucesso = document.getElementById('mensagemSucesso');
    mensagemSucesso.textContent = mensagem;
    mensagemSucesso.classList.remove('d-none');
}

// Chama a função para listar os usuários quando a página for carregada
document.addEventListener('DOMContentLoaded', listarUsuarios);
