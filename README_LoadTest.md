# 🚀 Teste de Carga - API Autenticação Empresarial

## 📋 Sobre o Teste de Carga

Este arquivo JMeter (`Desafio3-M2_LoadTest.jmx`) foi criado para testar a performance e comportamento da API de autenticação empresarial sob carga.

## 🛠️ Configuração do Thread Group

### Thread Group 1: Login Test
- **Usuários simultâneos:** 10 threads
- **Ramp-up:** 30 segundos (usuários são iniciados gradualmente)
- **Loop:** 1 execução por usuário
- **Tempo total estimado:** ~35 segundos

### Thread Group 2: Cadastro Test  
- **Usuários simultâneos:** 5 threads
- **Ramp-up:** 15 segundos
- **Loop:** 1 execução por usuário
- **Tempo total estimado:** ~20 segundos

## 📊 Headers Configurados

### Headers Padrão
```
Content-Type: application/json
Accept: application/json
User-Agent: JMeter-LoadTest/1.0
```

## 🔧 Como Executar

### Pré-requisitos
1. **JMeter instalado** (versão 5.6.3 ou superior)
2. **API rodando** em `http://localhost:3004`
3. **Java 8+** instalado

### Passos para Execução

1. **Abra o JMeter:**
   ```bash
   jmeter
   ```

2. **Carregue o arquivo de teste:**
   - File → Open
   - Selecione: `Desafio3-M2_LoadTest.jmx`

3. **Configure a URL base (se necessário):**
   - No Test Plan, edite a variável `baseURL`
   - Padrão: `http://localhost:3004`

4. **Execute o teste:**
   - Clique no botão ▶️ (Start)
   - Ou use Ctrl+R

5. **Monitore os resultados:**
   - View Results Tree: Detalhes de cada requisição
   - Aggregate Report: Estatísticas gerais

## 📈 Endpoints Testados

### 1. POST /login
**Payload:**
```json
{
  "login": "usuario@empresa.com",
  "senha": "Senha123",
  "dispositivo": "JMeter-{threadNum}"
}
```

**Assertions:**
- Status Code: 200
- Token JWT presente na resposta

### 2. POST /cadastro
**Payload:**
```json
{
  "email": "usuario{threadNum}@teste.com",
  "username": "usuario{threadNum}",
  "senha": "Senha123",
  "nome": "Usuário Teste {threadNum}",
  "dataNascimento": "1990-01-01",
  "nomePai": "João Teste {threadNum}",
  "nomeMae": "Maria Teste {threadNum}"
}
```

**Assertions:**
- Status Code: 201

## ⏱️ Timers Configurados

- **Login Test:** 1 segundo entre requisições
- **Cadastro Test:** 2 segundos entre requisições

## 📊 Métricas Coletadas

### View Results Tree
- Tempo de resposta
- Status codes
- Dados de resposta
- Headers
- Latência

### Aggregate Report
- Média de tempo de resposta
- Throughput (requisições/segundo)
- Percentis (50%, 90%, 95%, 99%)
- Taxa de erro
- Bytes transferidos

## 🎯 Cenários de Teste

### Cenário 1: Login Concorrente
- **Objetivo:** Testar capacidade de login simultâneo
- **Usuários:** 10 simultâneos
- **Ramp-up:** 30 segundos
- **Expectativa:** Todos os logins devem ser bem-sucedidos

### Cenário 2: Cadastro Concorrente
- **Objetivo:** Testar capacidade de cadastro simultâneo
- **Usuários:** 5 simultâneos
- **Ramp-up:** 15 segundos
- **Expectativa:** Todos os cadastros devem ser bem-sucedidos

## 🔍 Análise dos Resultados

### Métricas Importantes
1. **Response Time:** Deve ser < 2 segundos
2. **Throughput:** Requisições por segundo
3. **Error Rate:** Deve ser 0%
4. **Concurrent Users:** Capacidade de suportar usuários simultâneos

### Limitações da API
- **Máximo 3 sessões simultâneas** por usuário
- **Bloqueio após 3 tentativas** de login inválidas
- **Token JWT expira** em 10 minutos

## 🚨 Considerações Importantes

### Antes de Executar
1. **API deve estar rodando** em `http://localhost:3004`
2. **Usuário de teste** já cadastrado: `usuario@empresa.com`
3. **Sem bloqueios ativos** no usuário de teste

### Durante o Teste
1. **Monitore o console** da API para logs
2. **Verifique se não há bloqueios** de usuário
3. **Observe o comportamento** de sessões simultâneas

### Após o Teste
1. **Analise os relatórios** gerados
2. **Verifique logs** da API
3. **Compare resultados** com SLAs esperados

## 📝 Personalização

### Modificar Número de Usuários
1. Abra o arquivo `.jmx` no JMeter
2. Selecione o Thread Group
3. Altere o campo "Number of Threads"

### Modificar Ramp-up
1. Selecione o Thread Group
2. Altere o campo "Ramp-up period (seconds)"

### Adicionar Novos Endpoints
1. Clique com botão direito no Thread Group
2. Add → Sampler → HTTP Request
3. Configure URL, método e payload

## 🎯 Próximos Passos

1. **Teste de Stress:** Aumentar usuários gradualmente
2. **Teste de Endurance:** Executar por períodos longos
3. **Teste de Spike:** Picos súbitos de carga
4. **Teste de Volume:** Grande volume de dados

---

**Desenvolvido para:** Desafio3-M2 - API Autenticação Empresarial  
**Versão:** 1.0  
**Data:** 2024 