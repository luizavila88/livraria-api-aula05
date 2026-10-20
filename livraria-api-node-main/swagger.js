// Arquivo: swagger.js
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Livraria Comunitária API',
    version: '1.0.0',
    description: 'Documentação formal da API RESTful de livros e autores com clean architecture, autenticação stateless (JWT) e controle de acesso baseado em Perfis.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local de Desenvolvimento'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT obtido no endpoint de login (sem a palavra Bearer, apenas o token).'
      }
    },
    schemas: {
      ErroPadrao: {
        type: 'object',
        properties: {
          erro: {
            type: 'string',
            example: 'Mensagem descritiva do erro ocorrido.'
          }
        }
      },
      RegistroInput: {
        type: 'object',
        required: ['nome', 'email', 'senha'],
        properties: {
          nome: { type: 'string', example: 'Carlos Drummond' },
          email: { type: 'string', format: 'email', example: 'carlos@email.com' },
          senha: { type: 'string', format: 'password', example: 'senhaSegura123' },
          role: { type: 'string', enum: ['USER', 'ADMIN'], default: 'USER', example: 'USER' }
        }
      },
      UsuarioOutput: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 17123456789 },
          nome: { type: 'string', example: 'Carlos Drummond' },
          email: { type: 'string', example: 'carlos@email.com' },
          role: { type: 'string', example: 'USER' }
        }
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@livraria.com' },
          senha: { type: 'string', format: 'password', example: 'admin123' }
        }
      },
      LoginOutput: {
        type: 'object',
        properties: {
          usuario: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              nome: { type: 'string', example: 'Admin' },
              role: { type: 'string', example: 'ADMIN' }
            }
          },
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5vbWUiOiJBZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcx...'
          }
        }
      },
      AutorInput: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: { type: 'string', example: 'Clarice Lispector' },
          nacionalidade: { type: 'string', example: 'Brasileira' }
        }
      },
      AutorOutput: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nome: { type: 'string', example: 'Machado de Assis' },
          nacionalidade: { type: 'string', example: 'Brasileiro' }
        }
      },
      ComentarioInput: {
        type: 'object',
        required: ['texto'],
        properties: {
          texto: { type: 'string', example: 'Uma obra-prima da literatura brasileira!' }
        }
      },
      ComentarioOutput: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 17123456999 },
          autor_nome: { type: 'string', example: 'Leitor' },
          texto: { type: 'string', example: 'Clássico indispensável.' }
        }
      },
      LivroInput: {
        type: 'object',
        required: ['titulo', 'autor_id'],
        properties: {
          titulo: { type: 'string', example: 'A Hora da Estrela' },
          ano: { type: 'integer', example: 1977 },
          autor_id: { type: 'integer', example: 1 }
        }
      },
      LivroOutput: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          titulo: { type: 'string', example: 'Dom Casmurro' },
          ano: { type: 'integer', example: 1899 },
          autor_id: { type: 'integer', example: 1 },
          autor_nome: { type: 'string', example: 'Machado de Assis' },
          comentarios: {
            type: 'array',
            items: { $ref: '#/components/schemas/ComentarioOutput' }
          }
        }
      }
    }
  },
  paths: {
    '/api/v1/auth/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Cadastra um novo usuário no sistema',
        description: 'Rota pública para criação de conta de usuário. A senha é armazenada utilizando hash criptográfico BCrypt.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegistroInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Usuário cadastrado com sucesso.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UsuarioOutput' }
              }
            }
          },
          '400': {
            description: 'Dados inválidos ou campos obrigatórios ausentes (nome, email ou senha).',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'Campos obrigatórios ausentes: nome, email ou senha.' }
              }
            }
          },
          '409': {
            description: 'Conflito: O e-mail informado já está cadastrado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'E-mail já cadastrado no sistema.' }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Autentica um usuário e emite um token JWT',
        description: 'Rota pública que valida as credenciais com BCrypt e retorna um token JWT assinado válido por 2 horas.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login realizado com sucesso e token emitido.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginOutput' }
              }
            }
          },
          '400': {
            description: 'Requisição malformada (e-mail ou senha ausentes).',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'E-mail e senha são obrigatórios.' }
              }
            }
          },
          '401': {
            description: 'Não autorizado: E-mail não encontrado ou senha incorreta.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'Credenciais inválidas.' }
              }
            }
          }
        }
      }
    },
    '/api/v1/livros': {
      get: {
        tags: ['Livros'],
        summary: 'Lista todos os livros do catálogo',
        description: 'Rota pública que retorna a listagem completa de livros com o nome do autor e seus respectivos comentários.',
        responses: {
          '200': {
            description: 'Lista de livros retornada com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/LivroOutput' }
                }
              }
            }
          },
          '500': {
            description: 'Erro interno no servidor.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'Ocorreu um erro interno no servidor.' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Livros'],
        summary: 'Cadastra um novo livro no catálogo (Exclusivo ADMIN)',
        description: 'Endpoint protegido por RBAC. Requer token JWT válido no header Authorization e perfil de acesso ADMIN.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LivroInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Livro cadastrado com sucesso.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LivroOutput' }
              }
            }
          },
          '400': {
            description: 'Erro de validação: título ou autor_id ausentes.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'O título e o autor_id são obrigatórios.' }
              }
            }
          },
          '401': {
            description: 'Não autorizado: Token ausente, inválido ou expirado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'Acesso negado: Token de autenticação não fornecido.' }
              }
            }
          },
          '403': {
            description: 'Acesso proibido: Usuário autenticado não possui o perfil ADMIN.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'Acesso proibido: Privilégio de ADMIN exigido para esta operação.' }
              }
            }
          },
          '404': {
            description: 'Autor informado não existe no banco de dados.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'O autor informado não existe.' }
              }
            }
          }
        }
      }
    },
    '/api/v1/livros/{id}': {
      get: {
        tags: ['Livros'],
        summary: 'Busca detalhes de um livro específico pelo ID',
        description: 'Rota pública que retorna os dados detalhados de um único livro e seus comentários.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID numérico do livro',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'Livro encontrado com sucesso.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LivroOutput' }
              }
            }
          },
          '404': {
            description: 'Livro não localizado com o ID especificado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'Livro não localizado.' }
              }
            }
          }
        }
      }
    },
    '/api/v1/livros/{id}/comentarios': {
      post: {
        tags: ['Livros'],
        summary: 'Adiciona um comentário a um livro (Requer Autenticação)',
        description: 'Permite que qualquer usuário autenticado (USER ou ADMIN) publique uma avaliação em um livro existente. O nome do autor do comentário é extraído automaticamente do payload do token JWT.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID numérico do livro a ser comentado',
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ComentarioInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Comentário adicionado com sucesso.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ComentarioOutput' }
              }
            }
          },
          '400': {
            description: 'O texto do comentário está vazio ou ausente.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'O texto do comentário não pode estar vazio.' }
              }
            }
          },
          '401': {
            description: 'Não autorizado: Token ausente, inválido ou expirado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'Acesso negado: Token de autenticação não fornecido.' }
              }
            }
          },
          '404': {
            description: 'Livro não localizado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'Livro não localizado.' }
              }
            }
          }
        }
      }
    },
    '/api/v1/autores': {
      get: {
        tags: ['Autores'],
        summary: 'Lista todos os autores cadastrados',
        description: 'Rota pública para consulta de autores disponíveis.',
        responses: {
          '200': {
            description: 'Lista de autores retornada com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/AutorOutput' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Autores'],
        summary: 'Cadastra um novo autor (Exclusivo ADMIN)',
        description: 'Endpoint protegido por RBAC. Apenas usuários autenticados com perfil ADMIN podem cadastrar novos autores.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AutorInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Autor cadastrado com sucesso.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AutorOutput' }
              }
            }
          },
          '400': {
            description: 'Erro de validação: O nome do autor é obrigatório.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'O nome do autor é obrigatório.' }
              }
            }
          },
          '401': {
            description: 'Não autorizado: Token JWT ausente, inválido ou expirado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'Acesso negado: Token de autenticação não fornecido.' }
              }
            }
          },
          '403': {
            description: 'Acesso proibido: Usuário não possui perfil admin.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroPadrao' },
                example: { erro: 'Acesso proibido: Privilégio de admin exigido para esta operação.' }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = swaggerSpec;