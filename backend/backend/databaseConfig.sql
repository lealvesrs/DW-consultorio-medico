-- databaseConfig.sql
CREATE DATABASE consultorio;
\c consultorio;

-- Extensões
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ======================
--  Usuários (login)
-- ======================
CREATE TABLE IF NOT EXISTS usuarios (
  usuarioid BIGSERIAL CONSTRAINT pk_usuarios PRIMARY KEY,
  username  VARCHAR(50) UNIQUE NOT NULL,
  password  TEXT NOT NULL,
  deleted   BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO usuarios (username, password)
VALUES
  ('admin',  crypt('admin',  gen_salt('bf'))),
  ('qwe', crypt('qwe', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;

-- ======================
--  Pacientes
-- ======================
CREATE TABLE IF NOT EXISTS pacientes (
  paciente_id BIGSERIAL CONSTRAINT pk_pacientes PRIMARY KEY,
  cpf         VARCHAR(11) UNIQUE,
  nome        TEXT NOT NULL CHECK (btrim(nome) <> ''),
  endereco    TEXT,
  telefone    VARCHAR(20),
  removido    BOOLEAN NOT NULL DEFAULT FALSE
);

-- ======================
--  Exames (catálogo)
-- ======================
CREATE TABLE IF NOT EXISTS exames (
  exame_id   BIGSERIAL CONSTRAINT pk_exames PRIMARY KEY,
  nome       TEXT NOT NULL CHECK (btrim(nome) <> ''),
  descricao  TEXT,
  valor      NUMERIC(9,2) NOT NULL DEFAULT 0 CHECK (valor >= 0),
  removido   BOOLEAN NOT NULL DEFAULT FALSE
);

-- ======================
--  Receitas (1:N com pacientes)
-- ======================
CREATE TABLE IF NOT EXISTS receitas (
  receita_id   BIGSERIAL CONSTRAINT pk_receitas PRIMARY KEY,
  paciente_id  BIGINT NOT NULL
               CONSTRAINT fk_receitas_paciente
               REFERENCES pacientes(paciente_id)
               ON UPDATE CASCADE
               ON DELETE RESTRICT,
  descricao    TEXT NOT NULL CHECK (btrim(descricao) <> ''),
  data_emissao DATE NOT NULL,
  valor_total  NUMERIC(9,2) NOT NULL DEFAULT 0 CHECK (valor_total >= 0),
  removido     BOOLEAN NOT NULL DEFAULT FALSE
);

-- ======================
--  Exame_Paciente (N:M)
-- ======================
CREATE TABLE IF NOT EXISTS exame_paciente (
  exame_paciente_id BIGSERIAL CONSTRAINT pk_exame_paciente PRIMARY KEY,
  paciente_id       BIGINT NOT NULL
                    CONSTRAINT fk_examepac_paciente
                    REFERENCES pacientes(paciente_id)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT,
  exame_id          BIGINT NOT NULL
                    CONSTRAINT fk_examepac_exame
                    REFERENCES exames(exame_id)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT,
  data_exame        DATE NOT NULL,
  laudo             TEXT,
  removido          BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT uq_exame_paciente UNIQUE (paciente_id, exame_id, data_exame)
);

-- ======================
--  Dados iniciais
-- ======================

-- Pacientes
INSERT INTO pacientes (cpf, nome, endereco, telefone, removido) VALUES
  ('12345678901','Ana Silva',   'Rua das Flores, 100',  '+55 11 99999-0001', FALSE),
  ('98765432100','Bruno Souza', 'Av. Central, 200',     '+55 11 98888-0002', FALSE),
  ('11122233344','Carla Lima',  'Rua Alfa, 300',        '+55 11 97777-0003', FALSE)
ON CONFLICT DO NOTHING;

-- Exames
INSERT INTO exames (nome, descricao, valor, removido) VALUES
  ('Hemograma Completo', 'Avaliação geral das células sanguíneas', 120.00, FALSE),
  ('Raio-X de Tórax',    'Imagem do tórax para avaliação pulmonar',180.00, FALSE),
  ('Ultrassom Abd.',     'Ultrassonografia de abdômen total',      250.00, FALSE)
ON CONFLICT DO NOTHING;

-- Receitas
INSERT INTO receitas (paciente_id, descricao, data_emissao, valor_total, removido)
VALUES
  ((SELECT paciente_id FROM pacientes ORDER BY paciente_id ASC LIMIT 1),
    'Dipirona 500mg — 1 comp a cada 8h por 3 dias', CURRENT_DATE, 25.00, FALSE),
  ((SELECT paciente_id FROM pacientes ORDER BY paciente_id ASC OFFSET 1 LIMIT 1),
    'Amoxicilina 500mg — 1 cáps a cada 8h por 7 dias', CURRENT_DATE - INTERVAL '2 day', 38.50, FALSE)
ON CONFLICT DO NOTHING;

-- Exames realizados (Exame_Paciente)
INSERT INTO exame_paciente (paciente_id, exame_id, data_exame, laudo, removido)
VALUES
  ((SELECT paciente_id FROM pacientes ORDER BY paciente_id ASC LIMIT 1),
   (SELECT exame_id FROM exames WHERE nome = 'Hemograma Completo' LIMIT 1),
   CURRENT_DATE - INTERVAL '3 day', 'Resultados dentro da referência.', FALSE),

  ((SELECT paciente_id FROM pacientes ORDER BY paciente_id ASC LIMIT 1),
   (SELECT exame_id FROM exames WHERE nome = 'Raio-X de Tórax' LIMIT 1),
   CURRENT_DATE - INTERVAL '1 day', 'Sinais discretos de hiperinsuflação.', FALSE),

  ((SELECT paciente_id FROM pacientes ORDER BY paciente_id ASC OFFSET 1 LIMIT 1),
   (SELECT exame_id FROM exames WHERE nome = 'Ultrassom Abd.' LIMIT 1),
   CURRENT_DATE - INTERVAL '5 day', 'Fígado com ecotextura preservada.', FALSE)
ON CONFLICT DO NOTHING;

-- ======================
--  Consultas úteis
-- ======================

-- Pacientes ativos
SELECT * FROM pacientes
WHERE removido = FALSE
ORDER BY nome;

-- Exames ativos (ordenados por nome)
SELECT * FROM exames
WHERE removido = FALSE
ORDER BY nome;

-- Receitas ativas (com paciente)
SELECT r.*, p.nome AS paciente_nome
FROM receitas r
JOIN pacientes p ON p.paciente_id = r.paciente_id
WHERE r.removido = FALSE AND p.removido = FALSE
ORDER BY r.data_emissao DESC, r.receita_id DESC;

-- Exames realizados (com paciente e exame)
SELECT ep.*, p.nome AS paciente_nome, e.nome AS exame_nome
FROM exame_paciente ep
JOIN pacientes p ON p.paciente_id = ep.paciente_id
JOIN exames    e ON e.exame_id    = ep.exame_id
WHERE ep.removido = FALSE AND p.removido = FALSE AND e.removido = FALSE
ORDER BY ep.data_exame DESC, ep.exame_paciente_id DESC;
