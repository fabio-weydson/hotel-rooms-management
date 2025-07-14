-- Dados de exemplo para testes
-- Execute este script apenas em ambiente de desenvolvimento

-- Inserir tipos de usuário (se não existirem)
INSERT INTO usuario_tipo (nome) VALUES 
('GOVERNANTA'), 
('PROPRIETARIO') 
ON CONFLICT (nome) DO NOTHING;

-- Inserir usuários de exemplo
INSERT INTO usuarios (nome, cpf, telefone, tipo_id) VALUES 
('Maria Silva', 12345678901, '(11) 99999-9999', (SELECT id FROM usuario_tipo WHERE nome = 'GOVERNANTA')),
('João Santos', 98765432100, '(11) 88888-8888', (SELECT id FROM usuario_tipo WHERE nome = 'PROPRIETARIO'))
ON CONFLICT (cpf) DO NOTHING;

-- Inserir quartos de exemplo
INSERT INTO quartos (numero, tamanho, localizacao) VALUES 
(101, 'Standard', 'Térreo - Ala Norte'),
(102, 'Standard', 'Térreo - Ala Norte'),
(103, 'Deluxe', 'Térreo - Ala Sul'),
(201, 'Standard', 'Primeiro Andar - Ala Norte'),
(202, 'Suite', 'Primeiro Andar - Ala Norte'),
(203, 'Deluxe', 'Primeiro Andar - Ala Sul'),
(301, 'Suite Master', 'Segundo Andar - Cobertura'),
(302, 'Suite Master', 'Segundo Andar - Cobertura')
ON CONFLICT DO NOTHING;

-- Inserir itens de vistoria
INSERT INTO itens (nome) VALUES 
('Cama arrumada'),
('Lençóis limpos'),
('Travesseiros organizados'),
('Banheiro limpo'),
('Pia e torneira'),
('Espelho do banheiro'),
('Chuveiro funcionando'),
('Toalhas limpas'),
('Papel higiênico'),
('Sabonete/amenities'),
('Chão varrido e passado'),
('Móveis limpos'),
('TV funcionando'),
('Ar condicionado'),
('Cortinas/persianas'),
('Lixeira vazia'),
('Janelas limpas'),
('Varanda limpa'),
('Frigobar funcionando'),
('Cofre funcionando')
ON CONFLICT DO NOTHING;

-- Inserir algumas vistorias de exemplo
DO $$
DECLARE
    quarto_101_id UUID;
    quarto_102_id UUID;
    quarto_103_id UUID;
    maria_id UUID;
    vistoria_id UUID;
    item_cama_id UUID;
    item_banheiro_id UUID;
    item_toalhas_id UUID;
BEGIN
    -- Buscar IDs
    SELECT id INTO quarto_101_id FROM quartos WHERE numero = 101;
    SELECT id INTO quarto_102_id FROM quartos WHERE numero = 102;
    SELECT id INTO quarto_103_id FROM quartos WHERE numero = 103;
    SELECT id INTO maria_id FROM usuarios WHERE nome = 'Maria Silva';
    SELECT id INTO item_cama_id FROM itens WHERE nome = 'Cama arrumada';
    SELECT id INTO item_banheiro_id FROM itens WHERE nome = 'Banheiro limpo';
    SELECT id INTO item_toalhas_id FROM itens WHERE nome = 'Toalhas limpas';
    
    -- Vistoria finalizada para quarto 101
    INSERT INTO vistorias (id_quarto, id_responsavel, status, data) 
    VALUES (quarto_101_id, maria_id, 'FINALIZADA', NOW() - INTERVAL '2 hours')
    RETURNING id INTO vistoria_id;
    
    -- Itens da vistoria do quarto 101 (todos OK)
    INSERT INTO vistoria_itens (vistoria_id, item_id, comentario, foto)
    SELECT vistoria_id, i.id, NULL, NULL
    FROM itens i
    LIMIT 10;
    
    -- Vistoria em andamento para quarto 102
    INSERT INTO vistorias (id_quarto, id_responsavel, status, data) 
    VALUES (quarto_102_id, maria_id, 'INICIADA', NOW() - INTERVAL '30 minutes')
    RETURNING id INTO vistoria_id;
    
    -- Alguns itens avaliados no quarto 102
    INSERT INTO vistoria_itens (vistoria_id, item_id, comentario, foto)
    VALUES 
    (vistoria_id, item_cama_id, NULL, NULL),
    (vistoria_id, item_banheiro_id, 'Espelho com manchas', 'foto_espelho.jpg'),
    (vistoria_id, item_toalhas_id, 'Toalhas com manchas', 'foto_toalhas.jpg');
    
    -- Vistoria não iniciada para quarto 103 (sem registros)
END $$;

