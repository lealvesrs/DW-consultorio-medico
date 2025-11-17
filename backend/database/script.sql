-- script.sql (consultório)

-- (Opcional) Cria o banco e conecta nele

-- =========================
-- TABELAS
-- =========================

-- Pacientes
CREATE TABLE pacientes (
  paciente_id BIGSERIAL PRIMARY KEY,
  cpf         VARCHAR(11) UNIQUE,
  nome        TEXT NOT NULL CHECK (btrim(nome) <> ''),
  endereco    TEXT,
  telefone    VARCHAR(20),
  removido    BOOLEAN NOT NULL DEFAULT FALSE
);

-- Exames (catálogo)
CREATE TABLE exames (
  exame_id   BIGSERIAL PRIMARY KEY,
  nome       TEXT NOT NULL CHECK (btrim(nome) <> ''),
  descricao  TEXT,
  valor      NUMERIC(9,2) NOT NULL DEFAULT 0 CHECK (valor >= 0),
  removido   BOOLEAN NOT NULL DEFAULT FALSE
);

-- Receitas (1:N com pacientes)
CREATE TABLE receitas (
  receita_id   BIGSERIAL PRIMARY KEY,
  paciente_id  BIGINT NOT NULL,
  descricao    TEXT NOT NULL CHECK (btrim(descricao) <> ''),
  data_emissao TIMESTAMP NOT NULL,
  valor_total  NUMERIC(9,2) NOT NULL DEFAULT 0 CHECK (valor_total >= 0),
  removido     BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_receitas_paciente
    FOREIGN KEY (paciente_id)
    REFERENCES pacientes(paciente_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- Exame_Paciente (N:M entre pacientes e exames)
CREATE TABLE exame_paciente (
  exame_paciente_id BIGSERIAL PRIMARY KEY,
  paciente_id       BIGINT NOT NULL,
  exame_id          BIGINT NOT NULL,
  data_exame        DATE NOT NULL,
  laudo             TEXT,
  removido          BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_examepac_paciente
    FOREIGN KEY (paciente_id)
    REFERENCES pacientes(paciente_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_examepac_exame
    FOREIGN KEY (exame_id)
    REFERENCES exames(exame_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT uq_exame_paciente UNIQUE (paciente_id, exame_id, data_exame)
);