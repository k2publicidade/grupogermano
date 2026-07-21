# Backups do projeto

## Antes do modo espera da feira

- Arquivo: `backups/germano-antes-modo-espera-2026-07-20.zip`
- Criado em: 20/07/2026
- Conteúdo: código-fonte, configurações, dados, imagens, documentos e materiais gerados existentes antes da ativação do modo espera.
- Excluídos por serem recriáveis ou internos: `node_modules`, `.next`, `.git` e a própria pasta `backups`.

### Como restaurar

1. Guarde uma cópia do estado atual, caso necessário.
2. Extraia o ZIP na raiz de uma pasta vazia.
3. Execute `npm install`.
4. Execute `npm run build` para validar a restauração.

