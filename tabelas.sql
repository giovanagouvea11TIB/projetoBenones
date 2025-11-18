USE api_crud;
CREATE TABLE `Membros` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(100) NOT NULL,
    `nickname` varchar(50) NOT NULL,
    `linguagem_favorita` varchar(50) NOT NULL,
    `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `nickname` (`nickname`)
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci