USE codeforthefences;

CREATE TABLE users (
  `id` int(32) AUTO_INCREMENT primary key NOT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(48) NOT NULL
);
